"use client";
import Image from "next/image";
import { FormEvent, useState, useEffect } from "react";
import { AiFillHeart } from "react-icons/ai";
import {
    Box,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Input,
    Button,
    Checkbox,
} from "@chakra-ui/react";

import { database } from "./services/firebase";

type Materia = {
    chave: string;
    nome: string;
    faltas: string;
};

export default function Home() {
    const [nome, setNome] = useState("");
    const [faltas, setFaltas] = useState("");

    const [materias, setMaterias] = useState<Materia[]>();

    const [chave, setChave] = useState("");
    const [atualizando, setAtualizando] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const refMaterias = database.ref("materias");

        refMaterias.on("value", (resultado) => {
            const resultadoMateria = Object.entries<Materia>(
                resultado.val() ?? {}
            ).map(([chave, valor]) => {
                return {
                    chave: chave,
                    nome: valor.nome,
                    faltas: valor.faltas,
                };
            });

            setMaterias(resultadoMateria);
        });

        setLoading(false);
    }, []);

    function resetInputSpace() {
        setNome("");
        setFaltas("");
    }

    function gravar(event: FormEvent) {
        setLoading(true);
        event.preventDefault();

        const ref = database.ref("materias");
        if (nome.length > 0 && faltas.length < 1) {
            const faltas = "0";
            const dados = {
                nome,
                faltas,
            };
            ref.push(dados);
        } else if (nome.length > 0) {
            const dados = {
                nome,
                faltas,
            };
            ref.push(dados);
        }

        resetInputSpace();
        setLoading(false);
    }

    function removerFalta(materia: Materia) {
        const ref = database.ref('materias/')
        const nome = materia.nome;
        const chave = materia.chave;
        const faltaAtual = materia.faltas;
        const faltaDecrementada = +faltaAtual - 1;

        const dados = {
            'nome': nome,
            'faltas': faltaDecrementada.toString()
        };

        if (+faltaDecrementada < 0) {
            // Ensure that the absence count doesn't go below 0
            return;
        }

        ref.child(chave).update(dados);
    }

    function adicionarFalta(materia: Materia) {
        const ref = database.ref("materias/");
        const nome = materia.nome;
        const chave = materia.chave;
        const faltaAtual = materia.faltas;
        const faltaIncrementada = 1 + +faltaAtual;

        const dados = {
            nome: nome,
            faltas: faltaIncrementada,
        };
        if (+faltaAtual >= 5) {
        } else {
            ref.child(chave).update(dados);
        }
    }
    

    function calcularFalta(falta: String) {
        const faltaRestante: number = 5 - +falta;
        return faltaRestante;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-pink-200">
            <div className="p-4 bg-white rounded-lg shadow-lg md:m-10 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 flex items-center">
                    Controle de Presenças do Meu Amor. <AiFillHeart />{" "}
                </h1>

                {materias?.length === 0 ? (
                    <p className="text-gray-500">Nenhuma matéria adicionada.</p>
                ) : (
                    <ul>
                        {materias?.map((materia) => (
                            <li key={materia.chave} className="mb-4">
                                <div className="flex justify-between items-center">
                                    <span>{materia.nome}</span>
                                    <span>Faltas: {materia.faltas}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span>
                                        Faltas Restantes:{" "}
                                        {calcularFalta(materia.faltas)}
                                    </span>
                                    <div className="flex items-center">
                                        <button
                                            className="px-2 py-1 rounded bg-red-500 text-white"
                                            onClick={() =>
                                                adicionarFalta(materia)
                                            }
                                        >
                                            Faltei
                                        </button>
                                        <button
                                            className="px-2 py-1 rounded bg-green-500 text-white ml-2"
                                            onClick={() =>
                                                removerFalta(materia)
                                            } // Add this button
                                        >
                                            Remover Falta
                                        </button>
                                    </div>
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
                            <form>
                                <Input
                                    type="text"
                                    value={nome}
                                    onChange={(event) =>
                                        setNome(event.target.value)
                                    }
                                    placeholder="Nova Materia"
                                    required={true}
                                    my={4}
                                />
                                <Input
                                    value={faltas}
                                    onChange={(event) =>
                                        setFaltas(event.target.value)
                                    }
                                    placeholder="Quanto já faltou"
                                    required={true}
                                    my={4}
                                />
                                <Button
                                    padding={"10px"}
                                    rounded={"15px"}
                                    bg="pink"
                                    isLoading={loading}
                                    color="white"
                                    type="button"
                                    onClick={gravar}
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
