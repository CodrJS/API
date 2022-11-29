import GenericTemplate from "./Generic";

type RequiredParamsType = "name";
export default class WelcomeTemplate extends GenericTemplate<RequiredParamsType> {
  /**
   *
   * @param {string} template Email Template
   * @param {Object} options Required parameters for template
   */
  constructor() {
    const subject = "Welcome To TrustedRentr!";
    const temp = `Welcome to the TrustedRentr Network, {name}!

Let's get started on improving your renting experience!

On your dashboard page, you will find a list of next steps. You must complete all of them before you can start applying to any rental listing and/or pay your rent!

Feel free to reach out to us with questions at any time!

Thank you for signing up,
Your TrustedRentr Team`.replace(/\n/g, `<br />`);
    const opts: RequiredParamsType[] = ["name"];
    super(temp, subject, opts);
  }
}
