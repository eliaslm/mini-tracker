import {Checkbox, Input} from "@nextui-org/react";
import { useState } from "react";

import DefaultLayout from "@/layouts/default";
import BlurredCard from '@/BlurredCard'


export default function IndexPage() {
  const [input, setInput] = useState("foo@example.com");

  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <DefaultLayout>
      <div className='w-full'>
        <div className='flex w-full h-full justify-center my-10'>
          <BlurredCard/>
        </div>
        <div className='flex w-full h-full justify-center'>
          <BlurredCard />
        </div>
        <Input isDisabled={isDisabled} value={input} onValueChange={setInput} label="Email" type="email" />
        <p>
            {input}
        </p>
        <Checkbox isSelected={isDisabled} onValueChange={setIsDisabled}/>
      </div>
    </DefaultLayout>
  )
}