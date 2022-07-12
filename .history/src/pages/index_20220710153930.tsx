import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { useState } from 'react';

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

export default function Home({postsPagination}: HomeProps) {
  const [posts, setPosts] = useState<Post[]>([...postsPagination.results] || []);

  fetch(postsPagination.next_page)
    .then(res => res.json())
    .then(data => console.log(data));


  return (
    <main className={commonStyles.Container}>
      <div className={styles.Container}>
        <h1>Como utilizar Hooks</h1>
        <p>Pensando em sicronização em vez de ciclos de vida.</p>
        <div className={styles.ContentInfo}>
          <div className={styles.Date}>
            <FiCalendar />
            <span>15 Mar 2021</span>
          </div>
          <div className={styles.Author}>
            <FiUser />
            <span>Arthur Hendrich</span>
          </div>
        </div>
        <h1>Como utilizar Hooks</h1>
        <p>Pensando em sicronização em vez de ciclos de vida.</p>
        <div className={styles.ContentInfo}>
          <div className={styles.Date}>
            <FiCalendar />
            <span>15 Mar 2021</span>
          </div>
          <div className={styles.Author}>
            <FiUser />
            <span>Arthur Hendrich</span>
          </div>
        </div>
        <h1>Como utilizar Hooks</h1>
        <p>Pensando em sicronização em vez de ciclos de vida.</p>
        <div className={styles.ContentInfo}>
          <div className={styles.Date}>
            <FiCalendar />
            <span>15 Mar 2021</span>
          </div>
          <div className={styles.Author}>
            <FiUser />
            <span>Arthur Hendrich</span>
          </div>
        </div>
        <h1>Como utilizar Hooks</h1>
        <p>Pensando em sicronização em vez de ciclos de vida.</p>
        <div className={styles.ContentInfo}>
          <div className={styles.Date}>
            <FiCalendar />
            <span>15 Mar 2021</span>
          </div>
          <div className={styles.Author}>
            <FiUser />
            <span>Arthur Hendrich</span>
          </div>
        </div>
        
      </div>
      <div className={styles.Button}>
        <button>Carregar mais posts</button>
      </div>
    </main>
  );
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', {pageSize: 1});

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: postsResponse.results,
      }
    }
  }
};
