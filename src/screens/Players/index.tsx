import { useEffect, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Alert, FlatList, TextInput } from "react-native";

import { AppError } from "@utils/AppError";

import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroup } from "@storage/player/playersGetByGroup";

import ButtonIcon from "@components/ButtonIcon";
import Header from "@components/Header";
import HightLight from "@components/HightLight";
import Input from "@components/Input";
import Filter from "@components/Filter";
import PlayerCard from "@components/PlayerCard";
import ListEmpty from "@components/ListEmpty";
import Button from "@components/Button";

import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";
import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/playerStorageDTO";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";
import Loading from "@components/Loading";

type RouteParams = {
    group: string;
};

export default function Players() {
    const [isLoading, setIsLoading] = useState(true);
    const [newPlayerName, setNewPlayerName] = useState("");
    const [team, setTeam] = useState("Team A");
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

    const navigation = useNavigation();
    const route = useRoute();
    const { group } = route.params as RouteParams;

    const newPlayerNameInputRef = useRef<TextInput>(null);

    async function handleAddPlayer() {
        if (!newPlayerName.trim().length) {
            return Alert.alert(
                "Nova Pessoa",
                "Introduza o nome da pessoa que quer adicionar"
            );
        }

        const newPlayer = {
            name: newPlayerName.trim(),
            team,
        };

        try {
            await playerAddByGroup(newPlayer, group);

            newPlayerNameInputRef.current?.blur();

            setNewPlayerName("");
            fetchPlayersByTeam();
        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert("Nova pessoa", error.message);
            } else {
                console.log(error);
                Alert.alert("Nova pessoa", "Não foi possível adicionar");
            }
        }
    }

    async function fetchPlayersByTeam() {
        try {
            setIsLoading(true);
            const playersByTeam = await playersGetByGroupAndTeam(group, team);
            setPlayers(playersByTeam);
        } catch (error) {
            console.log(error);
            Alert.alert(
                "Pessoas",
                "Não foi possível carregar as pessoas da equipa selecionada."
            );
        } finally {
            setIsLoading(false);
        }
    }

    async function handlePlayerRemove(playerName: string) {
        try {
            await playerRemoveByGroup(playerName, group);
            fetchPlayersByTeam();
        } catch (error) {
            console.log(error);
            Alert.alert(
                "Remover Pessoa",
                "Não foi possível remover esta pessoa."
            );
        }
    }

    async function groupRemove() {
        try {
            await groupRemoveByName(group);
            navigation.navigate("groups");
        } catch (error) {
            console.log(error);
            Alert.alert("Remover Grupo", "Não foi possível remover o grupo.");
        }
    }

    async function handleGroupRemove() {
        Alert.alert("Remover", "Tem a certeza que deseja remover o Grupo?", [
            { text: "Não", style: "cancel" },
            { text: "Sim", onPress: () => groupRemove() },
        ]);
    }

    useEffect(() => {
        fetchPlayersByTeam();
    }, [team]);

    return (
        <Container>
            <Header showBackButton />

            <HightLight
                title={group}
                subtitle="Adicione os alunos e separe as equipas"
            />
            <Form>
                <Input
                    inputRef={newPlayerNameInputRef}
                    placeholder="Nome da pessoa"
                    autoCorrect={false}
                    onChangeText={setNewPlayerName}
                    value={newPlayerName}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType="done"
                />
                <ButtonIcon icon="add" onPress={handleAddPlayer} />
            </Form>
            <HeaderList>
                <FlatList
                    data={["Team A", "Team B"]}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <Filter
                            title={item}
                            isActive={item === team}
                            onPress={() => setTeam(item)}
                        />
                    )}
                    horizontal
                />
                <NumbersOfPlayers> {players.length} </NumbersOfPlayers>
            </HeaderList>
            {isLoading ? (
                <Loading />
            ) : (
                <FlatList
                    data={players}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                        <PlayerCard
                            name={item.name}
                            onRemove={() => handlePlayerRemove(item.name)}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <ListEmpty message="Não há pessoas nesta equipa." />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        { paddingBottom: 100 },
                        !players.length && { flex: 1 },
                    ]}
                />
            )}

            <Button
                title="Remover turma"
                type="SECONDARY"
                onPress={handleGroupRemove}
            />
        </Container>
    );
}
