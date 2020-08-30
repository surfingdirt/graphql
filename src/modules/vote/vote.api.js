const { BaseAPI } = require("../base");
const { SURVEY } = require("../../controllers");

module.exports = class VoteAPI extends BaseAPI {
  constructor(tracer) {
    super(tracer);

    this.path = SURVEY;
  }

  async getVote(surveyId, token) {
    console.log({surveyId});

    this.setToken(token);
    const response = await this.get(`${this.path}/${surveyId}/vote`);
    return response;
  }

  async castVote(input, token) {
    const { surveyId, choice } = input;

    this.setToken(token);
    const body = { choice };
    const response = await this.post(`${this.path}/${surveyId}/cast-vote`, body);
    return response;
  }
};
