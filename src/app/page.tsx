import ExteralLink from "@/components/ExternalLink";
import dynamic from 'next/dynamic'

const Convertor = dynamic(() => import('@/components/Converter'))

export default function Home() {
  return (
    <main className="container">
      <header className="py-10 space-y-3">
        <h1 className="text-2xl lg:text-4xl font-bold">Image to <ExteralLink title="BlurHash" url="https://blurha.sh/" /> and Blur{`(`}<ExteralLink url="https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs" title="DataUrls" />{`)`}</h1>
      </header>
      <Convertor />
    </main>
  )
}

