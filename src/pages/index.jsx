import { Button, CardFooter, Input, Skeleton } from "@nextui-org/react";
import { useState } from "react";
import { User } from "@nextui-org/react";
import { Card, CardBody } from "@nextui-org/react";
import { ScrollShadow } from "@nextui-org/react";

import DefaultLayout from "@/layouts/default";

import users from '@/../users.json';

console.log(users);


function UserCard({ user, isSkeleton = true }) {
    return (
        <>
            <Card isPressable
                onPress={() => {window.open(user.home_page, '_blank').focus();}}
                className="w-full">
                <CardBody>
                    <div className="items-start">
                        <Skeleton isLoaded={isSkeleton}>
                            <User
                                avatarProps={{
                                    src: user.profile_picture
                                }}
                                description={user.title}
                                name={user.name}
                            />
                        </Skeleton>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}

function UserCards({ users }) {
    return (
        <div>
            {users.map((user, index) => (
                <div className="my-2">
                    <UserCard key={index} user={user} />
                </div>
            ))}
        </div>
    );
}


export default function IndexPage() {
    const defaultUsers = users.users;
    const [allUsers, setAllUsers] = useState(defaultUsers);

    const [newUserName, setNewUserName] = useState("Anonymous-whale");
    const [newUserTitle, setNewUserTitle] = useState("Crossword Cracker");
    const [newUserProfilePicture, setNewUserProfilePicture] = useState("https://t3.ftcdn.net/jpg/07/69/91/30/360_F_769913002_jzJb1rJEFHrkwq1E5Vubqf7IUdyoPuhq.jpg");
    const [newUserHomePage, setNewUserHomePage] = useState("http://www.example.com");
    const [newUserMiniAvg, setNewUserMiniAvg] = useState("3:12");

    let newUser = {
        name: newUserName,
        title: newUserTitle,
        profile_picture: newUserProfilePicture,
        home_page: newUserHomePage,
        mini_avg: newUserMiniAvg,
    };
    const [newUserHasBeenSet, setNewUserHasBeenSet] = useState(false);

    function updateUsers() {
        setAllUsers([...defaultUsers, newUser]);
        setNewUserHasBeenSet(true);
    };

    let newUserCard;
    if (newUserHasBeenSet) {
        newUserCard = <UserCard user={{
            title: newUser.title,
            name: newUser.name,
            profile_picture: newUser.profile_picture,
            home_page: newUser.home_page
        }}
        />;
    } else {
        newUserCard = <Card>
            <CardBody>
                <div className="max-w-[300px] w-full flex items-center gap-3">
                    <div>
                        <Skeleton className="flex rounded-full w-12 h-12" />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <Skeleton className="h-3 w-3/5 rounded-lg" />
                        <Skeleton className="h-3 w-4/5 rounded-lg" />
                    </div>
                </div>
            </CardBody>
        </Card>;
    }

    return (
        <DefaultLayout>
            <div className="flex flex-col items-center gap-12">
                <div className="flex flex-row justify-center gap-12 w-full">
                    <div className="flex flex-col items-center gap-4 w-1/2">
                        <h1 className="text-3xl font-serif">Current Players</h1>
                        <div className="w-3/4">
                            <Card className="bg-slate-200 h-96">
                                <ScrollShadow hideScrollBar>
                                    <div className="w-3/4 justify-self-center">
                                        <UserCards users={allUsers} />
                                    </div>
                                </ScrollShadow>
                            </Card>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-4 w-1/2">
                        <div>
                            <h1 className="text-3xl font-serif">Standings</h1>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-12">
                    <h1 className="text-3xl font-serif">Enter your score and see how you compare!</h1>
                    <div className="flex flex-row gap-12 justify-center w-full">
                        <div className="flex flex-col gap-2 items-center w-1/2">
                            <h1 className="text-2xl font-serif">Your data</h1>
                            <Card className="w-full">
                                <CardBody className="flex flex-col gap-4 my-4">
                                    <Input label="Username" value={newUserName} onValueChange={setNewUserName} />
                                    <Input label="Title" value={newUserTitle} onValueChange={setNewUserTitle} />
                                    <Input label="Profile picture URL" value={newUserProfilePicture} onValueChange={setNewUserProfilePicture} />
                                    <Input label="Mini average" value={newUserMiniAvg} onValueChange={setNewUserMiniAvg} />
                                </CardBody>
                                <CardFooter>
                                    <Button color="primary" onPress={updateUsers}>Update user</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                    <div className="h-10" />
                </div>
            </div>
        </DefaultLayout>
    )
}