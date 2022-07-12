import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { RichText } from 'prismic-dom';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);

  return (
    <main className={commonStyles.Container}>
      <div className={styles.Container}>
        {posts.map(post => (
          <div>Hi there</div>
        ))}
      </div>
      <div className={styles.Button}>
        <button>Carregar mais posts</button>
      </div>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', { pageSize: 2 });

  console.log(postsResponse.results[0].data);

  const { title, subtitle, author, banner, content } = postsResponse.results[0].data; 

  const contents = {
    title: RichText.asText(title),
    subtitle: RichText.asText(subtitle),
    author: RichText.asText(author),
    banner: banner.url,
    content: RichText.asText(content),
  }

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: contents,
      },
    },
    revalidate: 60 * 60 * 24, // 1 day
  };
};


{/* <Link key={post.uid} href={`/post/${post.uid}`}>
<a key={post.uid}>
  <h1>{post.data.title}</h1>
  <p>{post.data.subtitle}</p>
  <div className={styles.ContentInfo}>
    <div className={styles.Date}>
      <FiCalendar />
      <span>
        {format(
          new Date(post.first_publication_date),
          'dd MMM yyyy',
          { locale: ptBR }
        )}
      </span>
    </div>
    <div className={styles.Author}>
      <FiUser />
      <span>{post.data.author}</span>
    </div>
  </div>
</a>
</Link> */}




