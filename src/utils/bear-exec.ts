/* eslint-disable no-console */

import { CLIError } from "@oclif/errors";
import XCall from "./xcall";
const { DEBUG } = process.env;

export const client = new XCall("bear");

export function buildParams(rawParams: object): any {
  const params: any = {};
  for (const [key, value] of Object.entries(rawParams)) {
    params[key.replace("-", "_")] = value;
  }

  return params
}

export function getCommand(action: string, rawParams: object): string {
  return client.buildCmd(action, buildParams(rawParams))
}

export function bearExec<T>(action: string, rawParams: object): Promise<T> {
  const params = buildParams(rawParams)

  if (DEBUG === "true") {
    console.log("action:", action);
    console.log("params:", params);
  }

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      throw new CLIError("Command timed out.");
    }, 30 * 1000); // timeout of 30 seconds

    if (DEBUG === "true") {
      console.log('client: ', client)
    }
    client
      .call(action, params)
      .then((response: string) => {
        if (DEBUG === "true") {
          console.log("raw response", response);
        }

        const parsedResponse = JSON.parse(response);
        delete parsedResponse[""];

        if (DEBUG === "true") {
          console.log("response", parsedResponse);
        }

        if (timeoutId) clearTimeout(timeoutId);
        resolve(parsedResponse);
      })
      .catch(error => {
        if (timeoutId) clearTimeout(timeoutId);
        const [, ...errLines] = error.message.split("\n");
        if (DEBUG === "true") {
          console.log("raw error:", error);
          console.log("err obj?:", errLines);
        }

        let parsedError;
        try {
          parsedError = JSON.parse(errLines.join("\n"));
        } catch (err) {
          return reject(
            new CLIError("Unexpected response received from Bear.")
          );
        }

        if (parsedError.errorMessage) {
          reject(new CLIError(parsedError.errorMessage));
        } else {
          reject(new CLIError(error));
        }
      });
  });
}
