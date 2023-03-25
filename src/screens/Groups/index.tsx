import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { groupsGetAll } from "@storage/group/groupsGetAll";

import GroupCard from "@components/GroupCard";
import Header from "@components/Header";
import HightLight from "@components/HightLight";
import ListEmpty from "@components/ListEmpty";
import Button from "@components/Button";

import { Container } from "./styles";
import Loading from "@components/Loading";

export default function Groups() {
    const [isLoading, setIsLoading] = useState(true);
    const [groups, setGroups] = useState<string[]>([]);

    const navigation = useNavigation();

    const handleNewGroup = () => {
        navigation.navigate("new");
    };

    const fetchGroups = async () => {
        try {
            setIsLoading(true);
            const data = await groupsGetAll();
            setGroups(data);
            
        } catch (error) {
            console.log(error);
            Alert.alert("Turmas", "Não foi possível carregar as turmas");
        }
        finally{
            setIsLoading(false);
        }
    };

    const handleOpenGroup = (group: string) => {
        navigation.navigate("players", { group });
    };

    useFocusEffect(
        useCallback(() => {
            fetchGroups();
        }, [])
    );

    return (
        <Container>
            <Header />

            <HightLight title="Turmas" subtitle="Jogue com a sua turma" />
            {isLoading ? (
                <Loading />
            ) : (
                <FlatList
                    data={groups}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <GroupCard
                            onPress={() => handleOpenGroup(item)}
                            title={item}
                        />
                    )}
                    contentContainerStyle={!groups.length && { flex: 1 }}
                    ListEmptyComponent={() => (
                        <ListEmpty message="Nenhuma turma criada" />
                    )}
                />
            )}

            <Button title="Criar nova Turma" onPress={handleNewGroup} />
        </Container>
    );
}
