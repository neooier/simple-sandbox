import { SandboxParameter } from './interfaces';
import nativeAddon from './nativeAddon';
import { SandboxProcess } from './sandboxProcess';
import { existsSync } from 'fs';
import * as randomString from 'randomstring';
import * as path from 'path';

// cgroup v2 检查：必须存在 unified 层级
if (!existsSync('/sys/fs/cgroup/cgroup.controllers')) {
    throw new Error('This program requires cgroup v2 (unified hierarchy). Please enable cgroup v2.');
}

export async function startSandbox(parameter: SandboxParameter): Promise<SandboxProcess> {
    return new Promise<SandboxProcess>((res, rej) => {
        const actualParameter = Object.assign({}, parameter);
        actualParameter.cgroup = path.join(actualParameter.cgroup, randomString.generate(9));
        nativeAddon.StartChild(actualParameter, function (err, result) {
            if (err)
                rej(err);
            else
                res(new SandboxProcess(result.pid, actualParameter));
        });
    });
};
