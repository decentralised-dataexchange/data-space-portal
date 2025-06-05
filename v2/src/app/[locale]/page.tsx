import HomePage from "@/components/Home";

interface Props {
    params: Promise<{ locale: string }>;
}

export default function Page ({params}: Props) {
    return <HomePage params={params} />
}
