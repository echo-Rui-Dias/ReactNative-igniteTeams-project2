import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

import { AppError } from "@utils/AppError";
import { groupCreate } from "@storage/group/groupCreate";

import { Container, Content, Icon } from "./styles";

import Button from "@components/Button";
import Header from "@components/Header";
import HightLight from "@components/HightLight";
import Input from "@components/Input";

export default function NewGroup() {
    const [group, setGroup] = useState("");

    const navigation = useNavigation();

    const handleNew = async () => {
        try {
            if(!group.trim().length){
                return Alert.alert(
                    "Novo Grupo",
                    "Insira o nome da turma."
                );
            }
            await groupCreate(group);
            navigation.navigate("players", { group });

        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert("Novo Grupo", error.message);
            } else {
                Alert.alert(
                    "Novo Grupo",
                    "Não foi possível criar um novo grupo."
                );
                console.log(error);
            }
        }
    };

    return (
        <Container>
            <Header showBackButton />
            <Content>
                <Icon />
                <HightLight
                    title="Nova turma"
                    subtitle="Crie a turma para adicionar as pessoas"
                />
                <Input placeholder="Nome da turma" onChangeText={setGroup} />
                <Button title="Criar" onPress={handleNew} />
            </Content>
        </Container>
    );
}
