const rp = require("request-promise");
const fs = require("fs");
const uuid = require("uuid");

const {
  apiUrl,
  storageLocalDomain,
  storageLocalPath,
  tmpFolder
} = require("../../../config");

const API_IMAGE_PATH = "image";

const StorageType = {
  LOCAL: "0"
};
const ImageSize = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large"
};
const ImageSizeSuffixes = {
  [ImageSize.SMALL]: "s",
  [ImageSize.MEDIUM]: "m",
  [ImageSize.LARGE]: "m"
};
const ImageType = {
  JPG: "jpg",
  PNG: "png",
  GIF: "gif",
  WEBP: "webp"
};

const buildThumbsAndImages = ({ imageId, mediaType, storageType }) => {
  switch (storageType) {
    case StorageType.LOCAL:
      const thumbs = [];
      const images = [];
      const path = `${storageLocalDomain}/${storageLocalPath}`;

      for (let sizeKey in ImageSize) {
        const size = ImageSize[sizeKey];
        for (let type of [ImageType.JPG, ImageType.WEBP]) {
          const suffix = `_${ImageSizeSuffixes[size]}`;
          const thumbSuffix = `_t${ImageSizeSuffixes[size]}`;
          images.push({
            size,
            type,
            url: `${path}/${imageId}/img${suffix}.${type}`
          });
          thumbs.push({
            size,
            type,
            url: `${path}/${imageId}/img${thumbSuffix}.${type}`
          });
        }
      }
      return { images, thumbs };
    default:
      throw new Error(
        `Unsupported storage type: '${storageType}' for video '${id}'`
      );
  }
};

const getFullUri = ({ path, urlParams = null, debugBackend = false }) => {
  let fullUri = `${apiUrl}/${path}`;
  const usp = new URLSearchParams();
  if (urlParams) {
    for (let arg in urlParams) {
      usp.append(arg, urlParams[arg]);
    }
  }
  if (debugBackend) {
    usp.append("XDEBUG_SESSION_START", "PHP_STORM");
  }
  const argString = usp.toString();
  if (argString) {
    fullUri = `${fullUri}?${argString}`;
  }

  return fullUri;
};

const storeTempFile = stream => {
  const filename = uuid.v4();
  const path = `${tmpFolder}/${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .on("error", error => {
        if (stream.truncated) {
          // Delete the truncated file.
          fs.unlinkSync(path);
        }
        reject(error);
      })
      .pipe(fs.createWriteStream(path))
      .on("error", error => reject(error))
      .on("finish", () => resolve(path))
  );
};

const postImage = async (file, token, data, debugBackend = false) => {
  const uri = getFullUri({ path: API_IMAGE_PATH, debugBackend });
  const headers = {
    Accept: "application/json",
    // Token already contains 'Bearer'
    Authorization: token,
    "Content-Type": "application/json"
  };

  const { createReadStream, filename, mimetype } = await file;
  const readableStream = await createReadStream();

  // Store file to disk fully, then restream to API:
  const tmpFilePath = await storeTempFile(readableStream);
  const value = fs.createReadStream(tmpFilePath);

  const response = await rp({
    method: "POST",
    json: true,
    uri,
    headers,
    simple: false,
    resolveWithFullResponse: true,
    // 'files' is the name of the variable holding upload info on the backend
    formData: Object.assign({}, data, {
      "files[]": [
        {
          value,
          options: {
            filename,
            contentType: mimetype
          }
        }
      ]
    })
  });
  try {
    fs.unlinkSync(tmpFilePath);
  } catch (e) {
    console.log(`Could not delete tmp file '${tmpFilePath}'`);
  }
  return response;
};

module.exports = {
  PhotoTypeResolvers: {},
  PhotoQueryResolvers: {
    photo: async (
      parent,
      args,
      { token, dataSources: { photoAPI, userAPI } }
    ) => {
      const photo = await photoAPI.getPhoto(args.id, token);
      const submitter = photo.submitter.id
        ? await userAPI.getUser(photo.submitter.id, token)
        : null;

      return Object.assign(
        {},
        photo,
        { submitter },
        buildThumbsAndImages(photo)
      );
    }
  },
  PhotoMutationResolvers: {
    createPhoto: async (parent, args, { token, dataSources: { photoAPI } }) => {
      const { input, file } = args;
      let imageResponse;
      try {
        const debugBackend = false;
        imageResponse = await postImage(
          file,
          token,
          { type: input.storageType },
          debugBackend
        );
      } catch (e) {
        console.log("Failed to post image to API");
        console.log(e);
        throw e;
      }

      // The REST API handles multiple images but this only handles one:
      const { body } = imageResponse;
      if (body.errors) {
        // TODO: how to report a proper error?
        throw new Error();
      }

      input.imageId = imageResponse.body[0].key;
      input.mediaType = "photo";

      try {
        const photo = await photoAPI.createPhoto(input, token);
        return Object.assign({}, photo, buildThumbsAndImages(photo));
      } catch (e) {
        console.log("Failed to create photo with previously uploaded image");
        console.log(e);
        // TODO: how to report a proper error?
        throw e;
      }
    },

    updatePhoto: async (parent, args, { token, dataSources: { photoAPI } }) => {
      const { id, input } = args;
      const photo = await photoAPI.updatePhoto(id, input, token);
      return Object.assign({}, photo, buildThumbsAndImages(photo));
    }
  },
  PhotoFieldResolvers: {
    async album(
      parent,
      args,
      {
        token,
        dataSources: { albumAPI }
      }
    ) {
      if (!parent.album.id) {
        return null;
      }
      return await albumAPI.getAlbum(parent.album.id, token);
    },

    async lastEditor(
      parent,
      args,
      {
        token,
        dataSources: { userAPI }
      }
    ) {
      if (!parent.lastEditor.id) {
        return null;
      }
      return await userAPI.getUser(parent.lastEditor.id, token);
    },

    async users(
      parent,
      args,
      {
        token,
        dataSources: { userAPI }
      }
    ) {
      const users = [];
      for (let userId of parent.users) {
        users.push(await userAPI.getUser(userId, token));
      }
      return users;
    }
  }
};
