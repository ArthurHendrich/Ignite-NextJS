import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { useState } from 'react';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Link from 'next/link';

import { RichText } from 'prismic-dom';

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
  const [posts, setPosts] = useState(postsPagination.results);
  const [page, setPage] = useState(postsPagination.next_page);


  async function handleLoadPost() {
    fetch(postsPagination.next_page)
      .then(response => response.json())
      .then(data => {
        const newPages = data.results.map(result => {
          return {
            uid: result.uid,
            first_publication_date: result.first_publication_date,
            data: {
              author: RichText.asText(result.data.author),
              title: RichText.asText(result.data.title),
              subtitle: RichText.asText(result.data.subtitle),
            }
          }
        })
        setPosts([...posts, ...newPages]);
        setPage(data.next_page);
      })
  }

  return (
    <main className={commonStyles.Container}>
      <div className={styles.Container}>
        {posts.map(post => (
          <Link key={post.uid} href={`/post/${post.uid}`}>
            <a key={post.uid}>
              <h1>{post.data.title.toString()}</h1>
              <p>{post.data.subtitle.toString()}</p>
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
                  <span>{post.data.author.toString()}</span>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
      <div className={styles.Button}>
        <button onClick={() => handleLoadPost}>Carregar mais posts</button>
      </div>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', { pageSize: 1 });

  // console.log(postsResponse.results[0].data);

  const content = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        author: RichText.asText(post.data.author),
        title: RichText.asText(post.data.title),
        subtitle: RichText.asText(post.data.subtitle),
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: content,
      },
    },
    revalidate: 60 * 60 * 24, // 1 day
  };
};
