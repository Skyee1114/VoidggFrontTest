import { useState, useEffect, useRef } from "react";
import { Table, Group, Input } from "@mantine/core";
import { useRouter } from "next/router";
import {debounce } from "loadsh";

type PostType = {
  createdAt: string;
  authorName: string;
  authorAvatar: string;
  postText: string;
  postImage: string;
  id: string;
};

export default function IndexPage() {
  const [data, setData] = useState<Array<PostType>>([]);
  const [showdata, setShowData] = useState<Array<PostType>>([]);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const router = useRouter();
  const prevDataRef = useRef<Array<PostType>>([]);

  let searchTimer: NodeJS.Timeout;

  useEffect(() => {
    async function fetchData() {
      
      try {
        const response = await fetch(
          `https://6396aee2a68e43e41808fa18.mockapi.io/api/posts?page=${page}&limit=5`
        );
        const newData = await response.json();
        console.log(newData.length, data.length);
        const newDataFiltered = newData.filter((newItem: any) => {
          return !prevDataRef.current.some((prevItem) => prevItem.id === newItem.id);
        });
        setData((prevData) => [...prevData, ...newDataFiltered]);
        prevDataRef.current = [...prevDataRef.current, ...newDataFiltered];
        setHasMore(newData.length > 0);
      } catch (err) {
        console.error("fetch error", err);
      }
      setLoading(false);
    }
    if (hasMore) {
        console.log(page, "in useeffect");
      fetchData();
    }
  }, [page]);

  function handleScroll() {
    if (
    window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.scrollHeight && !loading
    ) {
        setLoading(true);
      setPage((prevPage) => prevPage + 1);
    }
  }

  useEffect(() => {
    const handleScrollDebounced = debounce(handleScroll, 500);
    window.addEventListener("scroll", handleScrollDebounced);
    return () => window.removeEventListener("scroll", handleScrollDebounced);
  }, []);

  useEffect(() => {
    onSearchChange(search);
  }, [data]);

  const onSearchChange = (val: string) => {
    setSearch(val);
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      if (val === "") {
        setShowData(data);
        return;
      }
      const filteredData = data.filter((post) => {
        return post.authorName.includes(val) || post.postText.includes(val);
      });
      setShowData(filteredData);
    }, 500);
  }

  return (
    <Group mt={50} mx={100} justify="center">
      <Input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search"/>
      <Table highlightOnHover withColumnBorders withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>createdAt</Table.Th>
            <Table.Th>authorName</Table.Th>
            <Table.Th>authorAvatar</Table.Th>
            <Table.Th>postText</Table.Th>
            <Table.Th>postImage</Table.Th>
            <Table.Th>id</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {showdata.map((element, index) => {
            return (
              <Table.Tr key={index} onClick={() => {router.push(`/posts/${element.id}`)}}>
                <Table.Td>{element.createdAt}</Table.Td>
                <Table.Td>{element.authorName}</Table.Td>
                <Table.Td>{element.authorAvatar.toString()}</Table.Td>
                <Table.Td>{element.postText.toString()}</Table.Td>
                <Table.Td>{element.postImage}</Table.Td>
                <Table.Td>{element.id}</Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more data</p>}
    </Group>
  );
}
