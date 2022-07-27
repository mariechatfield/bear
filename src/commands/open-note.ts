/* eslint-disable no-console */
import { Command } from "@oclif/command";
import { FullNote } from "../types";
import { bearExec, getCommand } from "../utils/bear-exec";
import cmdFlags from "../utils/flags";
import { argsWithPipe } from "../utils/read-pipe";

const { DEBUG } = process.env

export default class OpenNote extends Command {
  static description = [
    "Fetch a note identified by its title or id.",
    "Returns the matched note's contents."
  ].join("\n");

  static flags = {
    help: cmdFlags.help,
    title: cmdFlags.title,
    header: cmdFlags.header,
    "exclude-trashed": cmdFlags["exclude-trashed"],
    "new-window": cmdFlags["new-window"],
    float: cmdFlags.float,
    "show-window": cmdFlags["show-window"],
    "open-note": cmdFlags["open-note"],
    selected: cmdFlags.selected,
    silent: cmdFlags.silent,
    pin: cmdFlags.pin,
    preview: cmdFlags.preview,
    edit: cmdFlags.edit,
    token: cmdFlags.token
  };

  static args = [{ name: "id", description: "note unique identifier" }];

  async run(): Promise<FullNote | string> {
    const { args: cmdArgs, flags } = this.parse(OpenNote);
    const args: { id?: string } = await argsWithPipe(OpenNote.args, cmdArgs);
    const params = { ...args, ...flags };

    if (params.id === undefined) {
      delete params.id
    }

    if (params.preview) {
      return getCommand("open-note", params)
    }

    const response = await bearExec<FullNote>("open-note", params);
    return response;
  }
}