import { Command, flags } from "@oclif/command";
import { NotesResponse } from "../types";
import { bearExec } from "../utils/bear-exec";
import { logNotes } from "../utils/log";
import { getToken } from "../utils/config";
import cmdFlags from "../utils/flags";

export default class Search extends Command {
  static description =
    "Show search results in Bear for all notes or for a specific tag.";

  static flags = {
    help: cmdFlags.help,
    "show-window": cmdFlags["show-window"],
    tag: flags.string({ char: "t", description: "tag to search into" })
  };

  static args = [{ name: "term", description: "string to search" }];

  async run() {
    const { args, flags } = this.parse(Search);
    const token = getToken(this.config.configDir);
    const params = { ...flags, ...args, token };

    try {
      const response = await bearExec<NotesResponse>("search", params);
      logNotes(response);
    } catch (error) {
      this.error(error, { exit: 1 });
    }
  }
}
