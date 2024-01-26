export interface RequestBody {
    type: string,
    cmd_chain: Commands[],
}

export interface Commands {
    type: string,
    cmd: any[],
}

export interface ResponseBody {
    status: string,
    statusCode: number,
    dbState: string[],
}