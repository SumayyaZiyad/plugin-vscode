import { ballerinaExtInstance } from "../../core";
import { commands, window } from "vscode";
import { TM_EVENT_EXECUTE_BALLERINA_RUN, CMP_BALLERINA_RUN } from "../../telemetry";
import { runCommand, BALLERINA_COMMANDS } from "./cmd-runner";
import { getCurrentBallerinaProject, getCurrentBallerinaFile, getCurrenDirectoryPath } from "../../utils/project-utils";

enum RUN_OPTIONS {
    RUN_FILE = "run-file", RUN_MODULE = "run-module", RUN_FILE_OBS = "run-file-observability",
    RUN_MODULE_OBS = "run-module-observability"
}

enum OBS_PARAMS {
    OBS_INCLUDED = "--observability-included", OBS_ENABLED = "--b7a.observability.enabled=true",
    OBS_PROVIDER = "--b7a.observability.provider=choreo"
}

function activateRunCommand() {
    const reporter = ballerinaExtInstance.telemetryReporter;

    // register ballerina run handler
    commands.registerCommand('ballerina.project.run', async () => {
        try {
            reporter.sendTelemetryEvent(TM_EVENT_EXECUTE_BALLERINA_RUN, { component: CMP_BALLERINA_RUN });

            const runOptions: { description: string, label: string, id: string }[] = [
                {
                    description: "ballerina run <balfile>",
                    label: "Run the current file",
                    id: RUN_OPTIONS.RUN_FILE
                }, {
                    description: "ballerina run --observability-included <balfile>",
                    label: "Run the current file with Choreo observability",
                    id: RUN_OPTIONS.RUN_FILE_OBS
                }
            ];

            const currentProject = await getCurrentBallerinaProject();
            if (currentProject.path) {
                runOptions.push({
                    description: "ballerina run <module-name>",
                    label: "Run module",
                    id: RUN_OPTIONS.RUN_MODULE
                }, {
                    description: "ballerina run --observability-included <module-name>",
                    label: "Run module with Choreo observability",
                    id: RUN_OPTIONS.RUN_MODULE_OBS
                });

                const userSelection = await window.showQuickPick(runOptions, { placeHolder: 'Select a run option.' });
                if (userSelection!.id.includes(RUN_OPTIONS.RUN_FILE)) {
                    runCurrentFileOptions(userSelection);
                } else {
                    let moduleName;
                    do {
                        moduleName = await window.showInputBox({ placeHolder: 'Enter module name.' });
                    } while (!moduleName || moduleName && moduleName.trim().length === 0);

                    if (userSelection!.id === RUN_OPTIONS.RUN_MODULE) {
                        runCommand(currentProject, BALLERINA_COMMANDS.RUN, moduleName);
                    } else if (userSelection!.id === RUN_OPTIONS.RUN_MODULE_OBS) {
                        runCommand(currentProject, BALLERINA_COMMANDS.RUN, OBS_PARAMS.OBS_INCLUDED, `${moduleName}`,
                            OBS_PARAMS.OBS_ENABLED, OBS_PARAMS.OBS_PROVIDER);
                    }
                }

            } else {
                const userSelection = await window.showQuickPick(runOptions, { placeHolder: 'Select a run option.' });
                runCurrentFileOptions(userSelection);
            }

        } catch (error) {
            reporter.sendTelemetryException(error, { component: CMP_BALLERINA_RUN });
            window.showErrorMessage(error);
        }
    });
}

function runCurrentFile() {
    runCommand(getCurrenDirectoryPath(), BALLERINA_COMMANDS.RUN, getCurrentBallerinaFile());
}

function runCurrentFileWithObservability() {
    runCommand(getCurrenDirectoryPath(), BALLERINA_COMMANDS.RUN, OBS_PARAMS.OBS_INCLUDED, getCurrentBallerinaFile(),
        OBS_PARAMS.OBS_ENABLED, OBS_PARAMS.OBS_PROVIDER);
}

function runCurrentFileOptions(userSelection) {
    if (userSelection!.id === RUN_OPTIONS.RUN_FILE) {
        runCurrentFile();
    } else {
        runCurrentFileWithObservability();
    }
}

export { activateRunCommand };
