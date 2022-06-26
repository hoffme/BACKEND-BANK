import {
  Card,
  CardSearchFilter,
  CardSearchResult,
  CardsStoreAdapter,
} from "../../../adapters/cards";
import randomInRange from "../../../utils/random";

class CardStoreMemory implements CardsStoreAdapter {
  private readonly cards: Card[] = [];

  public async NewNumberCard(): Promise<string> {
    let number = Math.trunc(randomInRange(10000000, 99999999)).toString();

    while (this.cards.find((card) => card.number === number)) {
      number = Math.trunc(randomInRange(10000000, 99999999)).toString();
    }

    return number;
  }

  public async FindById(id: string): Promise<Card | null> {
    return this.cards.find((card) => card.id === id) || null;
  }

  public async Search(filter: CardSearchFilter): Promise<CardSearchResult> {
    const start = filter.start || 0;
    const limit = filter.limit || 20;

    const cardsFiltered = this.cards.filter((card) => {
      return !filter.userId || filter.userId === card.user.id;
    });

    const cardsSorted = cardsFiltered.sort((cardA, cardB) => {
      switch (filter.orderBy) {
        case "balance":
          return filter.orderAsc
            ? cardB.balance - cardA.balance
            : cardA.balance - cardB.balance;
        case "number":
          return filter.orderAsc
            ? cardB.number.localeCompare(cardA.number)
            : cardA.number.localeCompare(cardB.number);
        case "type":
          return filter.orderAsc
            ? cardB.type.localeCompare(cardA.type)
            : cardA.type.localeCompare(cardB.type);
      }
      return 0;
    });

    const cards = cardsSorted.slice(start, limit);

    return {
      cards,
      start,
      limit,
      total: cardsSorted.length,
    };
  }

  public async Create(card: Card): Promise<void> {
    this.cards.push({ ...card });
  }

  public async Update(cardUpdate: Card): Promise<void> {
    const index = this.cards.findIndex((card) => card.id === cardUpdate.id);
    if (index < 0) throw new Error(`card not found with id ${cardUpdate.id}`);

    this.cards[index] = { ...cardUpdate };
  }

  public async Delete(cardDeleted: Card): Promise<void> {
    const index = this.cards.findIndex((card) => card.id === cardDeleted.id);
    if (index < 0) throw new Error(`card not found with id ${cardDeleted.id}`);

    this.cards.splice(index, 1);
  }
}

export default CardStoreMemory;
