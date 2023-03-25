import { Container, Message } from "./styles";

type Props = {
    message: string;
};

export default function ListEmpty({ message }: Props) {
    return (
        <Container>
            <Message>{message}</Message>
        </Container>
    );
}
