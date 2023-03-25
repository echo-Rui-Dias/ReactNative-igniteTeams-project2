import { useNavigation } from "@react-navigation/native";

import { BackButton, BackIcon, Container, Logo } from "./styles";

import logoImg from "@assets/logo.png";

type Props = {
    showBackButton?: boolean;
};

export default function Header({ showBackButton }: Props) {
    
    const navigation = useNavigation();
    
    const handleGoBack = () => {
        navigation.navigate("groups")
    }

    return (
        <Container>
            {showBackButton && (
                <BackButton onPress={handleGoBack}>
                    <BackIcon />
                </BackButton>
            )}

            <Logo source={logoImg} />
        </Container>
    );
}
