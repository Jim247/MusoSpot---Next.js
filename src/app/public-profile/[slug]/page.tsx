import PublicProfile from '@components/users/PublicProfile'

export default function PublicProfilePage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    return <PublicProfile slug={slug} />
}