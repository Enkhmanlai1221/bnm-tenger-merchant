import React from "react";
import {
  IconCamera,
  IconClock,
  IconLock,
  IconMoon,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";

const reviews = [
  {
    id: 1,
    rating: 5,
    content:
      " This icon pack is just what I need for my latest project. There's an icon for just about anything I could ever need. Love the playful look!",
    date: "July 16, 2021",
    datetime: "2021-07-16",
    name: "Emily Selman",
    avatar:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
  },
  {
    id: 2,
    rating: 2,
    content:
      "Blown away by how polished this icon pack is. Everything looks so consistent and each SVG is optimized out of the box so I can use it directly with confidence. It would take me several hours to create a single icon this good, so it's a steal at this price.",
    date: "July 12, 2021",
    datetime: "2021-07-12",
    name: "Hector Gibbons",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
  },
];

const staysCardData = [
  {
    image:
      "https://s3-alpha-sig.figma.com/img/ddc3/f731/3ceb3c21464cd9f22241be065b1597de?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ouXX5eCdpsIsgTwE8mZMlruW8sO~2z49t2MlPgOhmxgPyfL6rEXo3AP0taI5GMoQd-dHSIdhRAxeU2LrAjEyqtx0gopDx6MNTQ2r2wU6J8NaGRvNA7IZRGE0h4GGWLNMEvQ0-n9inIlDo17npDb1cWN2fbVqKLVZrfExcQCK50icDnlrZFzAPxoGevjUEC9naX6arlwFzWZL5HhCYvdFRtn6rfzryQzgKsF64JZxon79i~IlK4mRxq7f17pTkKmnv3mHN7DasnlI80Qjf9JWCa7RAFknjmeD451nUqKrIY2M2aNu17ufAX8aQ1Y1n7vqw6liuX07Jvf1w7~G5GeLDQ__",
    title: "Abstergo Ltd.",
    rate: 4.5,
    views: 120,
    location: "Great Falls, Maryland",
    price: 45,
    type: "FAVORITE",
  },
  {
    image:
      "https://s3-alpha-sig.figma.com/img/e7e1/510f/dc39fdc08e4bbeaa35cec34360c8b383?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=D8wurWTHSILBxHBPc0h005Ck7bIUQXs4y2Am9251MP7MmrCEj3aYomgOwDSFmIbuXOR86XnMHMDzo1xvVkwDCiyzZUoAVA9crIm6tkwK9WeHPx777~xdcQCtq9BE933S5sobYWqYJl4fUT3x2ZpxfzTywU-YjfZjD2rGVwCiss3ItmP0aIgb0A1jZodiyJRynPSQTcFfXdG4sQvuYk7DqG5PnhbPg5WmdqzpqHWjL931pJ~hDWBgMjYSIn-hjMiDx1yaLsfZmfPKcjKPPZZHkEGpv7AaUqHKlEIW66bEroSGQmo2O82KDQxWTti48EMG93eAS9ChloQnoJzao3o2kA__",
    title: "Abstergo Ltd.",
    rate: 4.5,
    views: 120,
    location: "Great Falls, Maryland",
    price: 45,
    type: "SPONSORED",
  },
  {
    image:
      "https://s3-alpha-sig.figma.com/img/77b7/64a8/092757da32ca57fa88b209cb7a156bb2?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=OmuOl8br1Brpsk-WXtQre5~a7~237umKMU1qt1OlZmHX4BC~rr6jNoSNqlsMl1cSvicw6VsLnIOJvV~ha1Lq5z9aIc-cx7i3relVeQ1PZmMy~fVFBuYE5LPoWfaScuebYuwSA90UWx5VPcgS9z-1RfO5-gL5~R8-n0ZY1SYKld4NTmQFo7EAU2ht73hFTu1ins-Je0pGo6Jd~D9wBUSm-bjAvJWxMWOqTUaM3vgqOhrzFzBd3vziWgwb4VwQwdZwlGx~rbu7qFs8mfCGvkx1aj1cQ5cX7L7P6bMVpouZLo4qiJI2sNR82uZdXHxvMeeu4yHrtgnbV9nYPgPqGPToIw__",
    title: "Abstergo Ltd.",
    rate: 4.5,
    views: 120,
    location: "Great Falls, Maryland",
    price: 45,
    type: "FAVORITE",
  },
  {
    image:
      "https://s3-alpha-sig.figma.com/img/62ca/4c0c/9a306157d1e579cea3a15aaf3fbfee5d?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hdIMFwX8wx9G58vuScTlB4kao9sXKYGW6SKYC~ZOwk0yIJwBn~Sh05kcQoAsvQ-8yZf2hg5B7RrPleVcGeBMAkc15KfZ79WB-OcIhsNtmyQF~CbL8ikfkczd465-9OkflO7HKmXQyuKNm6A6NCGoOMX3DADwaqCC9br4CXWN8AbSgY05ox9GUtVY~yDiadkOK1vpUBPdDF1lDj9aknF25pwyMwj5vPowXg3kE1kNQaBCnBLrYIqOjpfowJWYbqITkTOcpQBO68YMPQG-X~i1vmQAa6neYvI~2G89dZIh-Yv0UEm5Y6RqXv2SXpbJEPfv~WkJh-GUxXmdEBXmVOS8tA__",
    title: "Abstergo Ltd.",
    rate: 4.5,
    views: 120,
    location: "Great Falls, Maryland",
    price: 45,
    type: "SPONSORED",
  },
  {
    image:
      "https://s3-alpha-sig.figma.com/img/8538/d6ee/1e07ea3b5cdb9d65359f9b2cd3aaa48b?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YdGGTCHgmZ4uwcclkqWgTjuPRHJrYT5AW-hD2p4wOI~GLE3kcsyWzJUXeGDANdrFZzKsISdnnOg0Vdq663UQJgHownEGtQDB-olLOHUvtRlBsRB1cBntYMA~R76gP7yycJFfslRnA8g8QD0H-agWcW--p2MLzoY8uMmvJRt~6gPaT9keN84WCM3f6M50Xg5g1prvb2Qp3toVRJkHOUoEwVF0DU3lkWLX5UTqEwumdU71Wvy0c-bV74AacVf6AhDEvoPWkeaVYNwV17mzotk2Qy0u9rN1PIsIKudlmx9kVo4TDCfwZtCgNea6VrSjpCB2bGkVzb4Fg~VM6ezCNWn-VA__",
    title: "Abstergo Ltd.",
    rate: 4.5,
    views: 120,
    location: "Great Falls, Maryland",
    price: 45,
    type: "FAVORITE",
  },
  {
    image:
      "https://s3-alpha-sig.figma.com/img/db3a/a02e/d1963088eb55b875fc958c782c0585af?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BrnjlpMigy3PVpqokMineATYfNjj64-I9TRq2BY8561LBnm2oGcat~lx3vL9yjQ7dggZRtlSNoU5p7a-VoFHC~YIW3d~eOjGGo95p4Y8IJsk87TtteyOblaMeGHTqchzHpQErFOKWZtdXACdpSvBvbGI9Q5oiWg8dJVF49uBheKLJoHp~5AtVWLAg-TxSB0Nt17znltac0uUrS6FXWVHCWH3FErfqy98HCO3RffKqcKIUphS1fHeRC68IZYJlMxbv8G131sSf0~jV7qv1BZ9Ns6ttGTh3UtKJsnXLiCCurpqB6tTtorUhBBS8vyfU77WEr9LqZ3b1vYnGpsNjJZ2DQ__",
    title: "Abstergo Ltd.",
    rate: 4.5,
    views: 120,
    location: "Great Falls, Maryland",
    price: 45,
    type: "SPONSORED",
  },
  {
    image:
      "https://s3-alpha-sig.figma.com/img/a550/8c3c/98964b9fd00523f4ff34482ff3800ac2?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=fJlI0gjDspIdGlonvaOeHAKwwf5QpW66clgQx80Adb8jB80JkAmaaBeAsvnS1uPPJx50Xw0tsJ9uxSN2pSi1PYvw6YqCLCaIVJRuHudexlxZxXAqvm1knO~LmObGwa2u2GDZOHpw0H6ATEm5rCyCsHJW3P2Qd7aHeGECAldy~qjaXTT5SWryZt0crBTmUiLUzXNySr8ikjv7abhMCYM37ABXTfM-JouuAcCUQzroVwsDOKSVB2shNyQXU5FlneVpqPqtwrqBRH3L5r8cHcgdE~fQ1~XZhMlqu4j~~pI3h515nWEdUijpXf4AukmhRTQK6k-DCgr7qwYV-idN~ddlrg__",
    title: "Abstergo Ltd.",
    rate: 4.5,
    views: 120,
    location: "Great Falls, Maryland",
    price: 45,
    type: "FAVORITE",
  },
  {
    image:
      "https://s3-alpha-sig.figma.com/img/6570/a01a/7a0c04cb857103e82e6b2a6567670345?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=aEH2vgEtoMh80NEENnQ5hK~yofyMP6fc-EZmDTdusXfyVDd1r6q~ZdlQR8bP0apKZdSOWRKgNXStqDhXNrqy1DCGLnOm19Vv3wd~btPBc~cWsVsHTB8ofLifGnvoTHYS5qZPMMyg5WYrX7~RUEpExfmkiuEaCjQ1GwdYgdGAw95NauJGtr1npSgnGEhZKamqQYww1s7vmcjZ-fkujVEwSnJ3ByyJVvH9UR80sh2U~O6JUev5VkKXt4oQJtUqgQWRb4dDlA9Jo~3fQrqIISJKJiro4vW0lR1TmcbDh0O4UcZi7szu~E1TvyzImw-FmptAVuB56l9HpS8PQ6DCetZlGQ__",
    title: "Abstergo Ltd.",
    rate: 4.5,
    views: 120,
    location: "Great Falls, Maryland",
    price: 45,
    type: "SPONSORED",
  },
  {
    image:
      "https://s3-alpha-sig.figma.com/img/46a2/f6bc/a6469783d587dafe2a717ae47e27101a?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pNp9W608YOPwMyO-EaJPfBkA4y3bzfNnUmhOcez9JpwuL-inA~SUrP4DreDfXe8mJJAXO5wC7X79xkmRS~vQh9NKfzpfkcOD8SHY9hVvGqHM1Wl3SWSWq5iW-26BNUQIkjHzIe-QGaoA7OY2D23aoKqaV05kOt62P8NB-RB-NtcsawIF73MqrHc4ZUz7xh5bQhmFOHZ-y-zgoVqFQZjonQIDnWfmmS-hXmKeElLSxfy-p3zGB1hYqhmWDBBwY6PtZ97YiQkDVIVSZPzQBh4a~7~aDl2cCW-x1iywA07utnaVrgyPIcNJVR3aNuC9O3-dLFxSwD0bSXY6uE4k4y5YMw__",
    title: "Abstergo Ltd.",
    rate: 4.5,
    views: 120,
    location: "Great Falls, Maryland",
    price: 45,
    type: "FAVORITE",
  },
];

const testCardData = [
  {
    img: "/beautiful-place1.jpeg",
    title: "Gandantegchinlen Monastery 1",
    route: "Buddism",
    description:
      "Gandantegchinlen Monastery, also known as Gandan Monastery, is a Buddhist monastery in Bayangol District, Ulaanbaatar, Mongolia. It was founded in 1809, closed amid persecutions in 1939, and from 1944 to 1989 was the country's only active monastery. Today, it is the center of Buddhism in Mongolia.",
    location: "Ulaanbaatar 13th street",
  },
  {
    img: "/beautiful-place2.jpeg",
    title: "Chingis Khaan statue 2",
    route: "History",
    description:
      "Gandantegchinlen Monastery, also known as Gandan Monastery, is a Buddhist monastery in Bayangol District, Ulaanbaatar, Mongolia. It was founded in 1809, closed amid persecutions in 1939, and from 1944 to 1989 was the country's only active monastery. Today, it is the center of Buddhism in Mongolia.",
    location: "Ulaanbaatar 13th street",
  },
  {
    img: "/beautiful-place3.jpeg",
    title: "Ulaanbaatar center 3",
    route: "Place",
    description:
      "Gandantegchinlen Monastery, also known as Gandan Monastery, is a Buddhist monastery in Bayangol District, Ulaanbaatar, Mongolia. It was founded in 1809, closed amid persecutions in 1939, and from 1944 to 1989 was the country's only active monastery. Today, it is the center of Buddhism in Mongolia.",
    location: "Ulaanbaatar 13th street",
  },
  {
    img: "/beautiful-place1.jpeg",
    title: "Gandantegchinlen Monastery 4",
    route: "Buddism",
    description:
      "Gandantegchinlen Monastery, also known as Gandan Monastery, is a Buddhist monastery in Bayangol District, Ulaanbaatar, Mongolia. It was founded in 1809, closed amid persecutions in 1939, and from 1944 to 1989 was the country's only active monastery. Today, it is the center of Buddhism in Mongolia.",
    location: "Ulaanbaatar 13th street",
  },
  {
    img: "/beautiful-place2.jpeg",
    title: "Chingis Khaan statue 5",
    route: "History",
    description:
      "Gandantegchinlen Monastery, also known as Gandan Monastery, is a Buddhist monastery in Bayangol District, Ulaanbaatar, Mongolia. It was founded in 1809, closed amid persecutions in 1939, and from 1944 to 1989 was the country's only active monastery. Today, it is the center of Buddhism in Mongolia.",
    location: "Ulaanbaatar 13th street",
  },
  {
    img: "/beautiful-place3.jpeg",
    title: "Ulaanbaatar center 6",
    route: "Place",
    description:
      "Gandantegchinlen Monastery, also known as Gandan Monastery, is a Buddhist monastery in Bayangol District, Ulaanbaatar, Mongolia. It was founded in 1809, closed amid persecutions in 1939, and from 1944 to 1989 was the country's only active monastery. Today, it is the center of Buddhism in Mongolia.",
    location: "Ulaanbaatar 13th street",
  },
  {
    img: "/beautiful-place1.jpeg",
    title: "Gandantegchinlen Monastery 7",
    route: "Buddism",
    description:
      "Gandantegchinlen Monastery, also known as Gandan Monastery, is a Buddhist monastery in Bayangol District, Ulaanbaatar, Mongolia. It was founded in 1809, closed amid persecutions in 1939, and from 1944 to 1989 was the country's only active monastery. Today, it is the center of Buddhism in Mongolia.",
    location: "Ulaanbaatar 13th street",
  },
  {
    img: "/beautiful-place2.jpeg",
    title: "Chingis Khaan statue 8",
    route: "Place",
    description:
      "Gandantegchinlen Monastery, also known as Gandan Monastery, is a Buddhist monastery in Bayangol District, Ulaanbaatar, Mongolia. It was founded in 1809, closed amid persecutions in 1939, and from 1944 to 1989 was the country's only active monastery. Today, it is the center of Buddhism in Mongolia.",
    location: "Ulaanbaatar 13th street",
  },
];

const rulesData = [
  {
    backgroundColors: "blue",
    iconColor: "blue",
    icon: <IconClock size={25} />,
    title: "Check-in after",
    time: "2:00PM",
  },
  {
    backgroundColors: "blue",
    iconColor: "blue",
    icon: <IconClock size={25} />,
    title: "Chekout before",
    time: "11:00AM",
  },
  {
    backgroundColors: "yellow",
    iconColor: "yellow",
    icon: <IconMoon size={25} />,
    title: "Quiet hours",
    time: "10:00PM - 7:00AM",
  },
  {
    backgroundColors: "teal",
    iconColor: "teal",
    icon: <IconUsers size={25} />,
    title: "Guests maximum",
    time: "1",
  },
  {
    backgroundColors: "indigo",
    iconColor: "indigo",
    icon: <IconLock size={25} />,
    title: "Self check-in with lockbox",
    time: "",
  },

  {
    backgroundColors: "pink",
    iconColor: "pink",
    icon: <IconCamera size={25} />,
    title: "Commercial photography allowed",
    time: "",
  },
  {
    backgroundColors: "red",
    iconColor: "red",
    icon: <IconTrash size={25} />,
    title: "Throw trash away",
    time: "",
  },
];

const transactionHistoryData = [
  {
    type: "ACCEPTED",
    title: "Payment accepted",
    description: "Accepted",
  },
  {
    type: "REJECTED",
    title:
      "Transaction rejected by bank owner. Contact your bank support service.",
    description: "Accepted",
  },
  {
    type: "ACCEPTED",
    title: "Payment accepted",
    description: "Accepted",
  },
];

const methodsData = [
  {
    type: "PAYMENT",
    name: "Gantumur Battulga",
    email: "Testuser123@gmail.com",
  },
  {
    type: "PAYMENT",
    name: "Gantumur Battulga",
    email: "Testuser123@gmail.com",
  },
  {
    type: "VISA",
    name: "Gantumur Battulga",
    email: "4351 **** **** **** ****",
  },
  {
    type: "VISA",
    name: "Gantumur Battulga",
    email: "4351 **** **** **** ****",
  },
];

export {
  reviews,
  staysCardData,
  testCardData,
  rulesData,
  transactionHistoryData,
  methodsData,
};
