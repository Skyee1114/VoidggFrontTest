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
        console.log(data)
        
        const newTeamResults = data.map((match: any) => {
          const allPlayers = match.players.all_players;
          const playerIndex = allPlayers.findIndex(
            (player: any) => player.name === gameName && player.tag === tagLine
          );
          if (playerIndex !== -1) {
            const team = allPlayers[playerIndex].team === "Red" ? "red" : "blue";
            return match.teams[team].has_won;
          } else {
            return null;
          }
        });
        setTeamResult(newTeamResults);

        const newKills = data.map((match: any) => {
          const allPlayers = match.players.all_players;
          const playerIndex = allPlayers.findIndex(
            (player: any) => player.name === gameName && player.tag === tagLine
          );
          if (playerIndex !== -1) {            
            return allPlayers[playerIndex].stats.kills;
          } else {
            return null;
          }
        });
        setKills(newKills);

        const newDeaths = data.map((match: any) => {
          const allPlayers = match.players.all_players;
          const playerIndex = allPlayers.findIndex(
            (player: any) => player.name === gameName && player.tag === tagLine
          );
          if (playerIndex !== -1) {            
            return allPlayers[playerIndex].stats.deaths;
          } else {
            return null;
          }
        });
        setDeaths(newDeaths);

        const newAssists = data.map((match: any) => {
          const allPlayers = match.players.all_players;
          const playerIndex = allPlayers.findIndex(
            (player: any) => player.name === gameName && player.tag === tagLine
          );
          if (playerIndex !== -1) {            
            return allPlayers[playerIndex].stats.assists;
          } else {
            return null;
          }
        });
        setAssists(newAssists);

        const newCardsmall = data.map((match: any) => {
          const allPlayers = match.players.all_players;
          const playerIndex = allPlayers.findIndex(
            (player: any) => player.name === gameName && player.tag === tagLine
          );
          if (playerIndex !== -1) {            
            return allPlayers[playerIndex].assets.card.small;
          } else {
            return null;
          }
        });
        setCardsmall(newCardsmall);

        const newAgentsmall = data.map((match: any) => {
          const allPlayers = match.players.all_players;
          const playerIndex = allPlayers.findIndex(
            (player: any) => player.name === gameName && player.tag === tagLine
          );
          if (playerIndex !== -1) {            
            return allPlayers[playerIndex].assets.agent.small;
          } else {
            return null;
          }
        });
        setAgentsmall(newAgentsmall);

        const newMatchstarted = data.map((match: any) => {
          return match.metadata.game_start_patched;
        });
        setMatchStarted(newMatchstarted);

        const newMatchduration = data.map((match: any) => {
          const allPlayers = match.players.all_players;
          const playerIndex = allPlayers.findIndex(
            (player: any) => player.name === gameName && player.tag === tagLine
          );
          if (playerIndex !== -1) {            
            return allPlayers[playerIndex].session_playtime.minutes;
          } else {
            return null;
          }
        });
        setMatchDuration(newMatchduration);
        
      }
    } 
    fetchData()
  },[router.query.playerId])
    return (
      <Group mt={50} mx={100} justify="center">
        <Table highlightOnHover withColumnBorders withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Map</Table.Th>
              <Table.Th>Team result</Table.Th>
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