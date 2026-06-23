import { Request, Response } from "express";
import { getWorkspaceService } from "./workspace.service";
import { successResponse, errorResponse } from "../../utils/response";

// get workspace
export const getWorkspace = async (req:Request, res:Response) => {
    const workspaceId = req.user?.workspaceId;

    try {
        const workspace = await getWorkspaceService (workspaceId!) // find current workspace

        return successResponse(res, 200, "Workspace Fetched Successfully.", workspace)
        
    } catch (error){
        console.log(error)
        return errorResponse(res, 404, "Workspace Fetch Failed.")
    }
}