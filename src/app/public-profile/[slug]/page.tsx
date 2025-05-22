import PublicProfile from '@components/users/PublicProfile'

export default function PublicProfilePage({ params }: { params: { slug: string } }) {
    return <PublicProfile slug={params.slug} />
}