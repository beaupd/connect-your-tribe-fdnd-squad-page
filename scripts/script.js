const loadSRC = (src) => {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = src;
        img.onload = () => {
            resolve(img);
        };
        img.onerror = () => {
            reject("error");
        };
    });
};

const lazyMember = (member) => {
    return new Promise(async (resolve, reject) => {
        // console.log("loading", member.avatar, " of id: ", member.memberId);

        await loadSRC(member.avatar || "./assets/user_default.png")
            .then((img) => {
                // console.log("done Loading", img, "of id: ", member.memberId);
                resolve(img);
            })
            .catch((err) => reject(err));
    });
};

const Cards = {
    index: 0,
    api: new InterfaceMember(),
    cardContainer: document.querySelector("ul.cards"),
    cards: document.querySelectorAll("ul.cards .card"),
    members: [],
    randomDelay: false,

    memberElement(member, img) {
        let item = function (value) {
            let span = document.createElement("span");
            span.innerHTML = value;
            let li = document.createElement("li");
            li.appendChild(span);
            return li;
        };
        let listItem = document.createElement("li");
        listItem.classList.add("card");
        // let image = document.createElement("img");
        // image.src = "./assets/user_default.png";
        let unlistedList = document.createElement("ul");
        member.name &&
            member.surname &&
            unlistedList.appendChild(
                item(
                    `${member.name}${
                        member.prefix == "" ? " " : " " + member.prefix + " "
                    }${member.surname}`
                        .replace("  ", " ")
                        .replace("  ", " ")
                )
            );
        member.type && unlistedList.appendChild(item(member.type));
        member.nickname && unlistedList.appendChild(item(member.nickname));
        member.githubHandle &&
            unlistedList.appendChild(item(member.githubHandle));
        listItem.appendChild(img);
        listItem.appendChild(unlistedList);
        return listItem;
    },
    async getMembers() {
        await this.api.fetch();
        return this.api.members;
    },
    setMember(member, index, img) {
        // console.log("setting: ", member, " with id: ", member.memberId, "\n");
        if (this.randomDelay) {
            setTimeout(() => {
                this.cards[index].replaceWith(
                    this.memberElement(member, img ? img : undefined)
                );
            }, Math.random() * 10000);
        } else {
            this.cards[index].replaceWith(
                this.memberElement(member, img ? img : undefined)
            );
        }
    },
    async LoadMembers() {
        this.members.forEach((m, i) =>
            lazyMember(m).then((img) => this.setMember(m, i, img))
        );
    },
    async init() {
        this.members = await this.getMembers();
        let cards = document.createElement("ul");
        cards.classList.add("cards");
        this.members.forEach(() => {
            let card = document.createElement("li");
            card.classList.add("card");
            cards.appendChild(card);
        });
        this.cardContainer.replaceWith(cards);
        this.cards = document.querySelectorAll("ul.cards .card");

        this.LoadMembers();
    },
};

Cards.init();
