import Link from 'next/link';
import Layout from './components/Layout'

export default function Products() {
  return (
    <Layout>
      <Link className='bg-gray-300 py-2 px-3 rounded-md font-bold ' href={'/products/new'}>Añadir producto</Link>
    </Layout>
  );
}
