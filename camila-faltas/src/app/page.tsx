"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AiFillHeart } from "react-icons/ai";
import {
    Box,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Input,
    Button,
} from "@chakra-ui/react";

export default function Home() {
    const [materias, setMaterias] = useState<string[]>([]);
    const [faltas, setFaltas] = useState<{ [key: string]: number }>({});
//! deletar
    const [title, setTitle] = useState("");
    const [falta, setFalta] = useState("");
    const [loading, setLoading] = useState(false);
    const requestOptions = {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ data: { title: title, falta: falta } }),
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
    };
    
    const handleFaltaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFalta(event.target.value);
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      setLoading(true);
      e.preventDefault();
      await fetch("/api/add-materias", requestOptions)
        .then(() => {
          setFalta("");
          setTitle("");
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    };
    
//! até aqui
    const addMateria = () => {
        const novaMateria = prompt("Digite o nome da matéria:");
        if (novaMateria) {
            setMaterias([...materias, novaMateria]);
            setFaltas({ ...faltas, [novaMateria]: 0 });
        }
    };

    const removerMateria = (materia: string) => {
        const novasMaterias = materias.filter((m) => m !== materia);
        const { [materia]: _, ...novasFaltas } = faltas;
        setMaterias(novasMaterias);
        setFaltas(novasFaltas);
    };

    const incrementarFalta = (materia: string) => {
        setFaltas({ ...faltas, [materia]: faltas[materia] + 1 });
    };

    const faltasRestantes = (materia: string) => {
        const faltasAtuais = faltas[materia] || 0;
        return 4 - faltasAtuais;
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-pink-200">
            <div className="p-4 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4 flex items-center">
                    Controle de Presenças do Meu Amor. <AiFillHeart />{" "}
                </h1>
                {materias.length === 0 ? (
                    <p className="text-gray-500">Nenhuma matéria adicionada.</p>
                ) : (
                    <ul>
                        {materias.map((materia) => (
                            <li
                                key={materia}
                                className="flex justify-between items-center mb-2"
                            >
                                <span>{materia}</span>
                                <div className="flex items-center">
                                    <span className="mr-2">
                                        Faltas: {faltas[materia] || 0}
                                    </span>
                                    <span className="mr-2">
                                        Faltas Restantes:{" "}
                                        {faltasRestantes(materia)}
                                    </span>
                                    <button
                                        className="px-2 py-1 rounded bg-red-500 text-white"
                                        onClick={() =>
                                            incrementarFalta(materia)
                                        }
                                    >
                                        Falta
                                    </button>
                                    <button
                                        className="px-2 py-1 rounded bg-red-500 text-white ml-2"
                                        onClick={() => removerMateria(materia)}
                                    >
                                        Remover
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                <Accordion allowToggle mb="8" mt="2">
                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <Box flex="1" textAlign="left">
                                    Adicionar Materia
                                </Box>
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb="4">
                            <form onSubmit={onSubmit}>
                                <Input
                                    value={title}
                                    onChange={handleTitleChange}
                                    placeholder="Nova Materia"
                                    my={4}
                                />
                                <Input
                                    value={falta}
                                    onChange={handleFaltaChange}
                                    placeholder="Quantidade de Faltas"
                                    my={4}
                                />
                                <Button
                                    padding={"10px"}
                                    rounded={"15px"}
                                    bg="pink"
                                    isLoading={loading}
                                    disabled={title === "" || falta === ""}
                                    color="white"
                                    type="submit"
                                >
                                    Add materia
                                </Button>
                            </form>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
