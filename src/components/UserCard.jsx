import { Skeleton } from "@nextui-org/react";
import { User } from "@nextui-org/react";
import { Card, CardBody } from "@nextui-org/react";

export default function UserCard({ user, isSkeleton = true }) {
  return (
    <>
      <Card isPressable
        onPress={() => { if (user.home_page) window.open(user.home_page, '_blank').focus(); }}
        className="w-full max-w-3xl mx-auto my-3">
        <CardBody className="py-3">
          <div className="items-start">
            <Skeleton isLoaded={isSkeleton}>
              <User
                avatarProps={{
                  src: user.profile_picture || "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                  showFallback: true,
                  className: "w-12 h-12"
                }}
                description={user.title}
                name={user.name}
                classNames={{
                  name: "text-base font-semibold",
                  description: "text-sm text-gray-600 dark:text-gray-400"
                }}
              />
            </Skeleton>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
