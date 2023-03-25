import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppError } from "@utils/AppError";

import { groupsGetAll } from "./groupsGetAll";
import { GROUP_COLLECTION } from "@storage/storageConfig";

export async function groupCreate(newGroup: string) {
    try {
        const storaredGroups = await groupsGetAll();

        const groupAlreadyExists = storaredGroups.includes(newGroup);

        if(groupAlreadyExists){
            throw new AppError("Já existe um grupo com este nome.")
        }

        const storage = JSON.stringify([...storaredGroups, newGroup]);
        await AsyncStorage.setItem(GROUP_COLLECTION, storage);

    } catch (error) {
        throw error;
    }
}
