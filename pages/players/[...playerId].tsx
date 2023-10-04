import { useRouter } from 'next/router'
import { Table, Group, Avatar } from "@mantine/core";
import { useEffect, useState } from 'react';

type PlayerDetailType = {
  metadata: any;
  players: any;
  abservers: any;
  coaches: any;
  teams: any;
  rounds: any;
  kills: any;
};

export default function PlayerDetail() {
  const router = useRouter()
  const [data, setData] = useState<Array<PlayerDetailType>>([])
  const [teamresult, setTeamResult] = useState<boolean[]>([])
  const [kills, setKills] = useState<number[]>([]);
  const [deaths, setDeaths] = useState<number[]>([]);
  const [assists, setAssists] = useState<number[]>([]);
  const [cardsmall, setCardsmall] = useState<string[]>([]);
  const [agentsmall, setAgentsmall] = useState<string[]>([]);
  const [matchstarted, setMatchStarted] = useState<string[]>([]);
  const [matchduration, setMatchDuration] = useState<number[]>([]);

  useEffect(() => {
    const region = router.query.playerId?.[0]
    const gameName = router.query.playerId?.[1]
    const tagLine = router.query.playerId?.[2]

    async function fetchData() {
      if(gameName && tagLine){
        const response = await fetch(
          `https://api.henrikdev.xyz/valorant/v3/matches/${region}/${gameName}/${tagLine}`
        );
        const {data} = await response.json();
        setData(data)
        
        const newTeamResults: boolean[] = [];
        const newKills: number[] = [];
        const newDeaths: number[] = [];
        const newAssists: number[] = [];
        const newCardsmall: string[] = [];
        const newAgentsmall: string[] = [];
        const newMatchStarted: string[] = [];
        const newMatchDuration: number[] = [];

        data.forEach((match: any) => {
          const allPlayers = match.players.all_players;
          const playerIndex = allPlayers.findIndex(
            (player: any) => player.name === gameName && player.tag === tagLine
          );
          if (playerIndex !== -1) {
            const team = allPlayers[playerIndex].team === "Red" ? "red" : "blue";
            newTeamResults.push(match.teams[team].has_won);
            newKills.push(allPlayers[playerIndex].stats.kills);
            newDeaths.push(allPlayers[playerIndex].stats.deaths);
            newAssists.push(allPlayers[playerIndex].stats.assists);
            newCardsmall.push(allPlayers[playerIndex].assets.card.small);
            newAgentsmall.push(allPlayers[playerIndex].assets.agent.small);
            newMatchStarted.push(match.metadata.game_start_patched);
            newMatchDuration.push(allPlayers[playerIndex].session_playtime.minutes);
          }
        });

        setTeamResult(newTeamResults);
        setKills(newKills);
        setDeaths(newDeaths);
        setAssists(newAssists);
        setCardsmall(newCardsmall);
        setAgentsmall(newAgentsmall);
        setMatchStarted(newMatchStarted);
        setMatchDuration(newMatchDuration);
      }
    }

    fetchData();
  }, [router.query.playerId]);
    return (
      <Group mt={50} mx={100} justify="center">
        <Table highlightOnHover withColumnBorders withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Map</Table.Th>
              <Table.Th>Team Win</Table.Th>
              <Table.Th>kills</Table.Th>
              <Table.Th>deaths</Table.Th>
              <Table.Th>assists</Table.Th>
              <Table.Th>agent image</Table.Th>
              <Table.Th>card image</Table.Th>
              <Table.Th>MatchStarted</Table.Th>
              <Table.Th>MatchDuration/min</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{data && data.map((element, index) => {
                return (
                  <Table.Tr key={index}>
                    <Table.Td>{element.metadata.map}</Table.Td>
                    <Table.Td>{teamresult[index]?.toString()}</Table.Td>
                    <Table.Td>{kills[index]}</Table.Td>
                    <Table.Td>{deaths[index]}</Table.Td>
                    <Table.Td>{assists[index]}</Table.Td>
                    <Table.Td><Avatar src={agentsmall[index]} size="lg"/></Table.Td>
                    <Table.Td><Avatar src={cardsmall[index]} size="lg"/></Table.Td>
                    <Table.Td>{matchstarted[index]}</Table.Td>
                    <Table.Td>{matchduration[index]}</Table.Td>
                  </Table.Tr>
                );
              })}
          </Table.Tbody>
        </Table>
      </Group>
    );
  }