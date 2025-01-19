import { Skeleton } from "@nextui-org/react";
import { User } from "@nextui-org/react";
import { Card, CardBody } from "@nextui-org/react";


export default function UserCard({ user, isSkeleton = true }) {
  return (
    <>
      <Card isPressable
        onPress={() => { window.open(user.home_page, '_blank').focus(); }}
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
