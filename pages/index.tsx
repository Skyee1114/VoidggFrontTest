import { useState, useEffect } from "react";
import { Table, Group, Select } from "@mantine/core";
import { useRouter } from "next/router";

type PlayerType = {
  PlayerCardID: string;
  TitleID: string;
  IsBanned: boolean;
  IsAnonymized: boolean;
  puuid: string;
  gameName: string;
  tagLine: string;
  leaderboardRank: number;
  numberOfWins: number;
  competitiveTier: number;
  rankedRating: number;
};

export default function IndexPage() {
  const [data, setData] = useState<Array<PlayerType>>([]);
  const [pageSize, setPageSize] = useState(1000);
  const [region, setRegion] = useState("eu");
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://api.henrikdev.xyz/valorant/v2/leaderboard/${region}`
        );
        const data = await response.json();
        setData(data.players);
        console.log(data)
      } catch (err) {
        console.error("fetch error", err);
      }
    }
    fetchData();
  }, [region]);

  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.scrollHeight
      ) {
        setPageSize((prevPageSize) => prevPageSize + 1000);
      }
    }
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Group mx={100} justify="center">
      <Select
        data={[
          { value: "eu", label: "EU" },
          { value: "na", label: "NA" },
          { value: "ap", label: "AP" },
          { value: "br", label: "BR" },
          { value: "latam", label: "LA" },
          { value: "kr", label: "KR" },
        ]}
        label="Select region"
        placeholder="Choose region"
        value={region}
        onChange={(value) => {
          if(value !=null)
          setRegion(value)}
        }
      />
      <Table highlightOnHover withColumnBorders withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>PlayerCardID</Table.Th>
            <Table.Th>TitleID</Table.Th>
            <Table.Th>IsBanned</Table.Th>
            <Table.Th>IsAnonymized</Table.Th>
            <Table.Th>puuid</Table.Th>
            <Table.Th>gameName</Table.Th>
            <Table.Th>tagLine</Table.Th>
            <Table.Th>leaderboardRank</Table.Th>
            <Table.Th>rankedRating</Table.Th>
            <Table.Th>numberOfWins</Table.Th>
            <Table.Th>competitiveTier</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data &&
            data.slice(0, pageSize).map((element, index) => {
              return (
                <Table.Tr key={index} onClick={() => {router.push(`/players/${region}/${element.gameName}/${element.tagLine}`)}}>
                  <Table.Td>{element.PlayerCardID}</Table.Td>
                  <Table.Td>{element.TitleID}</Table.Td>
                  <Table.Td>{element.IsBanned.toString()}</Table.Td>
                  <Table.Td>{element.IsAnonymized.toString()}</Table.Td>
                  <Table.Td>{element.puuid}</Table.Td>
                  <Table.Td>{element.gameName}</Table.Td>
                  <Table.Td>{element.tagLine}</Table.Td>
                  <Table.Td>{element.leaderboardRank}</Table.Td>
                  <Table.Td>{element.rankedRating}</Table.Td>
                  <Table.Td>{element.numberOfWins}</Table.Td>
                  <Table.Td>{element.competitiveTier}</Table.Td>
                </Table.Tr>
              );
            })}
        </Table.Tbody>
      </Table>
    </Group>
  );
}
