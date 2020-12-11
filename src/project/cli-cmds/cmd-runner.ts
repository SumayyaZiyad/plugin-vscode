import { BallerinaProject } from "../../core/extended-language-client";
import { getCLIOutputChannel } from "./output";
import { spawn, spawnSync } from "child_process";

export enum BALLERINA_COMMANDS {
    TEST = "test", BUILD = "build", FORMAT = "format", RUN = "run", DOC = "doc"
}

export function runCommand(file: BallerinaProject | string, cmd: BALLERINA_COMMANDS, ...args: string[]) {
    const outputChannel = getCLIOutputChannel();
    outputChannel.clear();
    outputChannel.show();
    let filePath = '';
    typeof file === 'string' ? filePath = file : filePath = file.path!;
    outputChannel.appendLine("executing command: ballerina " + cmd + " at " + filePath + "\n");
    const process = spawn("ballerina", [cmd, ...args], { cwd: filePath });
    process.stdout.on('data', (data) => {
        outputChannel.append(data.toString());
    });
    process.stderr.on('data', (data) => {
        outputChannel.append(data.toString());
    });
    process.on("exit", () => {
        outputChannel.appendLine("Finished ballerina " + cmd + " command execution.");
    });
}

export function runCommandOnBackground(file: BallerinaProject | string, cmd: BALLERINA_COMMANDS, ...args: string[]): boolean {
    let filePath = '';
    typeof file === 'string' ? filePath = file : filePath = file.path!;
    const result = spawnSync("ballerina", [cmd, ...args], { cwd: filePath });
    if (result.status === 0) {
        return true;
    }
    return false;
}