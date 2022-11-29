import GenericTemplate from "./Generic";

type RequiredParamsType = "name" | "email" | "message";
export default class FeedbackTemplate extends GenericTemplate<RequiredParamsType> {
  /**
   *
   * @param {string} template Email Template
   * @param {Object} options Required parameters for template
   */
  constructor() {
    const subject = "Thank you for your feedback!";
    const requiredParams: RequiredParamsType[] = ["name", "email", "message"];
    const template =
      `We have received your input and the team will look into your request soon. If a response is required, it will be sent through an &quot;@trustedrentr.com&quot; email address.
Please <b>DO NOT</b> trust a response from any other email!

Your feedback:
From: {name} &lt;{email}&gt;
Message:
{message}

Thank you,
Your TrustedRentr Team`.replace(/\n/g, `<br />`);

    super(template, subject, requiredParams);

    this.bcc = ['"The TrustedRentr Team" <info@trustedrentr.com>'];
  }
}
