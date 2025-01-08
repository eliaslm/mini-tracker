import DefaultLayout from "@/layouts/default";
import BlurredCard from '@/BlurredCard'

export default function DummyPage() {
  return (
    <DefaultLayout>
      <div className='w-full'>
        <div className='flex w-full h-full justify-center pt-10 pb-10'>
            <h1 className="text-3xl font-bold underline">
                Hello from the dummy page!
            </h1>
        </div>
        <div className='flex w-full h-full justify-center'>
          <BlurredCard />
        </div>
      </div>
    </DefaultLayout>
  )
}
