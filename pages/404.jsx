import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/NotFound.module.css";
import Fuse from "fuse.js";
import glob from "glob";
import Link from "next/link";

const NotFoundPage = ({ pages }) => {
  const [results, setResults] = useState([]);
  const router = useRouter();
  console.log(p);

  useEffect(() => {
    const fuse = new Fuse(pages);
    const searchResults = fuse.search(router.asPath);
    setResults(searchResults.map((result) => result.item));
  }, [pages, router.asPath]);

  return (
    <div className={styles.container}>
      <img src="/notfound.jpeg" alt="404" width="400px" />
      <h1>Page your are trying to access could not be found</h1>
      {results?.length != 0 && (
        <div className={styles.subTitle}>Did you mean?</div>
      )}
      <div className={styles.suggestion}>
        {results?.map((result) => (
          <Link key={result} href={result}>
            <a className={styles.suggestionItem}>{result}</a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const pages = await new Promise((res, rej) => {
    const ignoreList = ["api", "_", "["];
    glob("**/*.js", { cwd: __dirname }, (err, fileList) => {
      if (err) {
        rej(err);
        return;
      }
      const routeList = fileList.map((item) => item.replace(".js", ""));
      const filteredRouteList = routeList.filter(
        (item) => !ignoreList.some((ignoreItem) => ignoreItem.startsWith(item))
      );
      res(filteredRouteList);
    });
  });

  return {
    props: {
      pages,
    },
  };
}

export default NotFoundPage;
