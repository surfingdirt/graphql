const rp = require('request-promise');
const fs = require('fs');
const uuid = require('uuid');
const { ApolloError } = require('apollo-server-express');

const { StorageType } = require('../constants');
const { apiUrl, tmpFolder } = require("../../config");

const API_IMAGE_PATH = 'image';

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

module.exports = {
  getFullUri,

  // TODO: refactor this in order to user imageAPI
  storeImageOnLocalAPI: async (file, token, debugBackend = false) => {
    const storeTempFile = (stream) => {
      const filename = uuid.v4();
      const path = `${tmpFolder}/${filename}`;
      return new Promise((resolve, reject) =>
        stream
          .on('error', (error) => {
            if (stream.truncated) {
              // Delete the truncated file.
              fs.unlinkSync(path);
            }
            reject(error);
          })
          .pipe(fs.createWriteStream(path))
          .on('error', (error) => reject(error))
          .on('finish', () => resolve(path)),
      );
    };

    const postImage = async (file, token, data, debugBackend = false) => {
      const uri = getFullUri({ path: API_IMAGE_PATH, debugBackend });
      const headers = {
        Accept: 'application/json',
        // Token already contains 'Bearer'
        Authorization: token,
        'Content-Type': 'application/json',
      };

      const { createReadStream, filename, mimetype } = await file;
      const readableStream = await createReadStream();

      // Store file to disk fully, then restream to API:
      const tmpFilePath = await storeTempFile(readableStream);
      const value = fs.createReadStream(tmpFilePath);

      const response = await rp({
        method: 'POST',
        json: true,
        uri,
        headers,
        simple: false,
        resolveWithFullResponse: true,
        // 'files' is the name of the variable holding upload info on the backend
        formData: Object.assign({}, data, {
          'files[]': [
            {
              value,
              options: {
                filename,
                contentType: mimetype,
              },
            },
          ],
        }),
      });
      try {
        fs.unlinkSync(tmpFilePath);
      } catch (e) {
        console.error(`Could not delete tmp file '${tmpFilePath}'`);
      }
      return response;
    };

    let imageResponse;
    try {
      imageResponse = await postImage(file, token, { type: StorageType.LOCAL }, debugBackend);
    } catch (e) {
      console.log('Failed to post image - GraphQL server exception:', e);
      throw e;
    }

    const { body } = imageResponse;
    // The REST API handles multiple images but this only handles one:

    if (body.errors && body.errors.topLevelError) {
      const { code } = body.errors.topLevelError;
      throw new ApolloError('Failed to post image to API', code);
    }

    const imageData = body[0];
    if (imageData.error) {
      console.log('Failed to post image to API - error code:', imageData.error);
      throw new ApolloError('Failed to post image to API', imageData.error);
    }

    return imageData;
  },
};
