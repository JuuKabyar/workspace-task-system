import { prisma } from "../../lib/prisma"

// get wrokspace
export const getWorkspaceService = async (workspaceId: number) => {
    const workspace = await prisma.workspace.findUnique({
        where: {
            id: workspaceId
        },
        include: {
            users: {
                omit: { // မလိုချင်တဲ့ ဟာကို ရွေးပီး ဖျောက်ထားချင်ရင် include -> 'omit' ကိုသုံး 
                    password: true, refreshToken: true
                }
            }
        }
    }) // find workspace by id

    if(!workspace){
        throw new Error("Workspace Not Found.")
    }

    return workspace
}