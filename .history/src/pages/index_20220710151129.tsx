import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser } from 'react-icons/fi';

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

export default function Home() {
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
  const postsResponse = await prismic.getByType('posts');

  console.log(postsResponse);


  return {
    props: {

    }
  }
};
