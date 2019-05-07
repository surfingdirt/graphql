const rp = require("request-promise");
const fs = require("fs");
const uuid = require("uuid");
const { ApolloError } = require("apollo-server-express");

const { tmpFolder } = require("../../../config");

const { MediaType, StorageType } = require("../../constants");
const { getFullUri } = require("../../utils/RestAPI");
const { buildThumbsAndImages } = require("../../utils/thumbs");

const API_IMAGE_PATH = "image";

const storeImageOnLocalAPI = async (file, token, debugBackend=false) => {
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

  let imageResponse;
  try {
    imageResponse = await postImage(
      file,
      token,
      { type: StorageType.LOCAL },
      debugBackend
    );
  } catch (e) {
    console.log("Failed to post image - GraphQL server exception:", e);
    throw e;
  }

  const { body } = imageResponse;
  // The REST API handles multiple images but this only handles one:
  const imageData = body[0];

  if (imageData.error) {
    console.log('Failed to post image to API - error code:', imageData.error);
    throw new ApolloError("Failed to post image to API", imageData.error);
  }

  return imageData;
};

module.exports = {
  PhotoTypeResolvers: {},
  PhotoQueryResolvers: {
    photo: async (
      parent,
      args,
      { token, supportsWebP, dataSources: { photoAPI, userAPI } }
    ) => {
      const photo = await photoAPI.getPhoto(args.id, token);
      const submitter = photo.submitter.id
        ? await userAPI.getUser(photo.submitter.id, token)
        : null;

      return Object.assign(
        {},
        photo,
        { submitter },
        buildThumbsAndImages(photo, true, supportsWebP)
      );
    }
  },
  PhotoMutationResolvers: {
    createPhoto: async (parent, args, { token, dataSources: { photoAPI } }) => {
      const { input, file } = args;

      const imageData = await storeImageOnLocalAPI(file, token);

      const creationPayload = Object.assign({}, input, {
        imageId: imageData.key,
        mediaType: MediaType.PHOTO,
      }) ;

      const photo = await photoAPI.createPhoto(creationPayload, token);
      return Object.assign({}, photo, buildThumbsAndImages(photo));
    },

    updatePhoto: async (parent, args, { token, dataSources: { photoAPI } }) => {
      const { id, input, file } = args;

      let updatePayload = Object.assign({}, input);
      if (file) {
        const imageData = await storeImageOnLocalAPI(file, token);
        updatePayload = Object.assign({}, input, {
          imageId: imageData.key,
        });
      }

      const photo = await photoAPI.updatePhoto(id, updatePayload, token);
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
