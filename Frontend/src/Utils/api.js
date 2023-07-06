var itr = -1;
var count = 0;
var itr = 0;

export default function getAPI() {
  const apis = [
    "9c45b04749085e0ac40d5f9098086d9a",
    "5013d724d09dcaaeb1e30488645f8614",
  ];
  count++;
  console.log(count);

  itr = (itr + 1) % apis.length;
  return apis[itr];
}
