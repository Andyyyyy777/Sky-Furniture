/**
 * Assign product-type-matched Unsplash images for each SKY_PRODUCTS id.
 * Run: node scripts/fix-product-images.js
 */
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "assets", "js", "data.js");
let s = fs.readFileSync(file, "utf8");

const map = {
  101: {
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80"
    ]
  },
  102: {
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=900&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=80"
    ]
  },
  103: {
    image: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=900&q=80",
      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=900&q=80"
    ]
  },
  104: {
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=900&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80"
    ]
  },
  105: {
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80"
    ]
  },
  106: {
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=900&q=80",
      "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=900&q=80"
    ]
  },
  201: {
    image: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=900&q=80",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80"
    ]
  },
  202: {
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80"
    ]
  },
  203: {
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80"
    ]
  },
  204: {
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=900&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80"
    ]
  },
  205: {
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=900&q=80",
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=900&q=80"
    ]
  },
  206: {
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=900&q=80",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=900&q=80"
    ]
  },
  301: {
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=900&q=80",
      "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=900&q=80"
    ]
  },
  302: {
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=900&q=80",
      "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=900&q=80"
    ]
  },
  303: {
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=900&q=80",
      "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=900&q=80"
    ]
  },
  304: {
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=900&q=80",
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=900&q=80"
    ]
  },
  305: {
    image: "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=900&q=80",
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=900&q=80"
    ]
  },
  306: {
    image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=900&q=80",
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=900&q=80"
    ]
  },
  401: {
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80",
      "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=900&q=80"
    ]
  },
  402: {
    image: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=900&q=80",
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80"
    ]
  },
  403: {
    image: "https://images.unsplash.com/photo-1617098900591-3f90928e8c54?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1617098900591-3f90928e8c54?w=900&q=80",
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80"
    ]
  },
  404: {
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=900&q=80",
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=900&q=80"
    ]
  },
  405: {
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=900&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=80"
    ]
  },
  406: {
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80",
      "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=900&q=80"
    ]
  },
  501: {
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80",
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=900&q=80"
    ]
  },
  502: {
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&q=80",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=900&q=80"
    ]
  },
  503: {
    image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=900&q=80",
      "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80"
    ]
  },
  504: {
    image: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=900&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&q=80"
    ]
  },
  505: {
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=900&q=80",
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=900&q=80"
    ]
  },
  506: {
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80",
      "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=900&q=80"
    ]
  },
  601: {
    image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=900&q=80",
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=900&q=80"
    ]
  },
  602: {
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900&q=80"
    ]
  },
  603: {
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=80"
    ]
  },
  604: {
    image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=900&q=80",
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=900&q=80"
    ]
  },
  605: {
    image: "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?w=900&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900&q=80"
    ]
  },
  606: {
    image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=900&q=80",
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=900&q=80"
    ]
  },
  701: {
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=900&q=80"
    ]
  },
  702: {
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=900&q=80",
      "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=900&q=80"
    ]
  },
  703: {
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=900&q=80",
      "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=900&q=80"
    ]
  },
  704: {
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=900&q=80",
      "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=900&q=80"
    ]
  },
  705: {
    image: "https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?w=900&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=900&q=80"
    ]
  },
  706: {
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=900&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=900&q=80"
    ]
  },
  707: {
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=900&q=80",
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=900&q=80"
    ]
  },
  708: {
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=900&q=80",
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=900&q=80"
    ]
  },
  709: {
    image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=900&q=80",
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=900&q=80"
    ]
  },
  710: {
    image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=900&q=80",
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=900&q=80"
    ]
  }
};

let updated = 0;
for (const [id, imgs] of Object.entries(map)) {
  const re = new RegExp(
    `(id:\\s*${id},[\\s\\S]*?)image:\\s*"[^"]+",\\s*images:\\s*\\[[\\s\\S]*?\\]`,
    "m"
  );
  if (!re.test(s)) {
    console.error("No match for id", id);
    continue;
  }
  const imagesStr = imgs.images.map((u) => `      "${u}"`).join(",\n");
  s = s.replace(
    re,
    `$1image: "${imgs.image}",\n    images: [\n${imagesStr}\n    ]`
  );
  updated += 1;
}

fs.writeFileSync(file, s);
console.log(`Updated ${updated} products in assets/js/data.js`);
