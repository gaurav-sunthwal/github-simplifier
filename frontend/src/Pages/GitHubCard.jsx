import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Card,
  HStack,
  Heading,
  Image,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
let auth = import.meta.env.VITE_GITHUB_CARD;
let issues = 0;
function GitHubCard() {
  const [inputValue, setInputValue] = useState("");
  const [useName, setUserName] = useState("gaurav-sunthwal");
  const [data, setData] = useState(null);
  const [rapos, setRapos] = useState(null);

  async function GitHubCardData() {
    try {
      let GitHubData = await fetch(`https://api.github.com/users/${useName}`, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });
      let result = await GitHubData.json();
      console.log(result);
      setData(result);
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
      console.log("Response status code:", error.response?.status);
      console.log("Response message:", error.response?.message);
    }
  }
  async function getInfo() {
    let url = `https://api.github.com/users/${useName}/repos`;
    try {
      // console.log("here", auth);
      let followerData = await fetch(url, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });
      let followerresult = await followerData.json();
      console.log(followerresult);
      setRapos(followerresult);
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
    }
  }
  useEffect(() => {
    GitHubCardData();
    getInfo();
    // followingData();
  }, [useName]);

  function handleClick(e) {
    e.preventDefault();
    setUserName(inputValue);
  }
  const updateUserName = (newUserName) => {
    setUserName(newUserName);
  };
  return (
    <div className="gitHubCard">
      
      <Box p={5}>
        <Card bg={"#1f1f1f"} color={"white"}>
          <Box marginTop={13} p={3}>
            <VStack w={"100%"}>
              <form
                className="gitInput"
                style={{
                  width: "60%",
                }}
              >
                <HStack>
                  <Input
                    type="text"
                    placeholder="Search UseName!!"
                    value={inputValue}
                    autoFocus
                    onChange={(e) => {
                      setInputValue(e.target.value);
                    }}
                    w={"100%"}
                  />
                  <Button type="submit" onClick={handleClick}>
                    Search
                  </Button>
                </HStack>
              </form>
            </VStack>
          </Box>
          {useName !== null ? (
            data && (
              <>
                <Box p={2}>
                  <VStack>
                    <Image
                      className="gitImg"
                      w={"25%"}
                      borderRadius={"50%"}
                      src={data.avatar_url}
                    />
                    <Box textAlign={"center"}>
                      <HStack justifyContent={"center"}>
                        <Link to={data.html_url} target="blank">
                          <Heading>{data.name}</Heading>
                        </Link>

                        {data.twitter_username !== null ? (
                          <Link
                            to={`https://twitter.com/${data.twitter_username}`}
                            target="blank"
                          >
                            <Text>@{data.twitter_username}</Text>
                          </Link>
                        ) : null}
                      </HStack>
                      <Text textAlign={"center"}>{data.company}</Text>
                      <Text>{data.bio}</Text>
                      <Box>
                        <Text>{data.email}</Text>
                      </Box>
                      <HStack justifyContent={"center"} m={2} flexWrap={"wrap"}>
                        <GetInfoCard
                          userName={useName}
                          data={"followers"}
                          number={data.followers}
                          infoName={"Followers"}
                          updateUserName={updateUserName}  
                        />
                        <GetInfoCard
                          userName={useName}
                          data={"following"}
                          number={data.following}
                          infoName={"Following"}
                          updateUserName={updateUserName}  
                        />
                        <GetInfoCard
                          userName={useName}
                          data={"repos"}
                          number={data.public_repos}
                          infoName={"Public Repos"}
                        />
                        <GetInfoCard
                          userName={useName}
                          data={"repos"}
                          infoName={"Open issues rapos list"}
                        />
                      </HStack>
                    </Box>
                  </VStack>
                </Box>
              </>
            )
          ) : (
            <VStack h={"70vh"} justifyContent={"center"}>
              <Heading>Search For User !!</Heading>
            </VStack>
          )}
        </Card>
      </Box>
    </div>
  );
}

function GetInfoCard(props) {
  const [infoData, setSetInfoData] = useState("followers");
  const [userName, setUserName] = useState(null);
  const [followers, setFollowers] = useState([]);
  async function getInfo() {
    let url = "";
    if (userName === null) {
      url = `https://api.github.com/users/${props.userName}/${props.data}`;
    } else {
      url = `https://api.github.com/users/${userName}/${props.data}`;
    }
    try {
      // console.log("here", auth);
      let followerData = await fetch(url, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });
      let followerresult = await followerData.json();
      console.log(followerresult);
      setFollowers(followerresult);
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
    }
  }
  useEffect(() => {
    getInfo();
  }, [props.userName, props.data, userName]);

  function showUser(item) {
    setUserName(item.login);
    // alert(item.login)
    props.updateUserName(item.login);
  }
  return (
    <Box>
      <Popover>
        <PopoverTrigger>
          <Button colorScheme="blue">
            {props.infoName}{" "}
            {props.infoName !== "Open issues rapos list"
              ? ": " + props.number
              : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader
            color={"black"}
          >{`${props.infoName}! >30 `}</PopoverHeader>
          <PopoverBody
            color={"black"}
            overflow={"auto"}
            height={
              props.data !== "repos" ||
              props.infoName === "Open issues rapos list"
                ? "30vh"
                : "60vh"
            }
          >
            {followers.map((item) => {
              // let open_issues = item.open_issues
              return props.data !== "repos" ? (
                <HStack
                  key={item.name}
                  overflow={"auto"}
                  m={2}
                  cursor={"pointer"}
                  onClick={() => showUser(item)}
                >
                  <Image borderRadius={"50%"} w={10} src={item.avatar_url} />
                  <Text>{item.login}</Text>
                </HStack>
              ) : props.infoName === "Open issues rapos list" ? (
                <>
                  {item.open_issues > 0 ? (
                    <HStack w={"100%"}>
                      <Accordion defaultIndex={[0]} allowMultiple w={"100%"}>
                        <AccordionItem w={"100%"}>
                          <h2>
                            <AccordionButton w={"100%"}>
                              <Box as="span" flex="1" textAlign="left">
                                {item.name}
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel pb={4}>
                            <Box textAlign={"start"}>
                              <Link to={item.html_url} target="_blank">
                                <Text>{item.full_name}</Text>
                              </Link>
                              <Text>Open Issues: {item.open_issues}</Text>
                              <Text>visibility: {item.visibility}</Text>
                            </Box>
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>
                    </HStack>
                  ) : null}
                </>
              ) : (
                <HStack w={"100%"}>
                  <Accordion defaultIndex={[0]} allowMultiple w={"100%"}>
                    <AccordionItem w={"100%"}>
                      <h2>
                        <AccordionButton w={"100%"}>
                          <Box as="span" flex="1" textAlign="left">
                            {item.name}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <Box textAlign={"start"}>
                          <Link to={item.html_url} target="_blank">
                            <Text>{item.full_name}</Text>
                          </Link>
                          <Text>Open Issues: {item.open_issues}</Text>
                          <Text>visibility: {item.visibility}</Text>
                        </Box>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </HStack>
              );
            })}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
}
export default GitHubCard;
