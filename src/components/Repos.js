import React from "react";
import { useContext } from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";

const Repos = () => {
  const { repos } = useContext(GithubContext);

  let languages = repos.reduce((total, item) => {
    const { language, stargazers_count } = item;

    if (!language) return total;

    !total[language]
      ? (total[language] = {
          label: language,
          value: 1,
          stars: stargazers_count,
        })
      : (total[language] = {
          ...total[language],
          value: total[language].value + 1,
          stars: total[language].stars + stargazers_count,
        });

    console.log(total);

    return total;
  }, {});

  const mostUsed = Object.values(languages)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  console.log(languages);
  /* const chartData = [
    {
      label: "JavaScript",
      value: "290",
    },
    {
      label: "HTML",
      value: "260",
    },
    {
      label: "CSS",
      value: "180",
    },
    {
      label: "ReactJS",
      value: "140",
    },
  ];*/
  const mostPopular = Object.values(languages)
    .sort((a, b) => b.stars - a.stars)
    .map((item) => {
      return { ...item, value: item.stars };
    })
    .slice(0, 5);
  console.log(mostPopular);
  return (
    <section className="section">
      <Wrapper>
        <Pie3D data={mostUsed} />
        <div></div>
        <Doughnut2D data={mostPopular} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
