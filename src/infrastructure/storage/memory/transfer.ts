import {
  Transfer,
  TransferSearchFilter,
  TransferSearchResult,
  TransferStoreAdapter,
} from "../../../adapters/transfer";

class TransferStoreMemory implements TransferStoreAdapter {
  private readonly transfers: Transfer[] = [];

  public async FindById(id: string): Promise<Transfer | null> {
    return this.transfers.find((transfer) => transfer.id === id) || null;
  }

  public async Search(
    filter: TransferSearchFilter
  ): Promise<TransferSearchResult> {
    const start = filter.start || 0;
    const limit = filter.limit || 20;

    const transfersFiltered = this.transfers.filter((transfer) => {
      if (filter.fromUserId && filter.fromUserId !== transfer.from.user.id)
        return false;
      if (filter.toUserId && filter.toUserId !== transfer.to.user.id)
        return false;
      if (filter.fromCardId && filter.fromCardId !== transfer.from.id)
        return false;
      if (filter.toCardId && filter.toCardId !== transfer.to.id) return false;
      if (filter.minDate && filter.minDate > transfer.date) return false;
      if (filter.maxDate && filter.maxDate < transfer.date) return false;
      if (filter.minValue && filter.minValue > transfer.value) return false;
      if (filter.maxValue && filter.maxValue < transfer.value) return false;

      return true;
    });

    const transfersSorted = transfersFiltered.sort((a, b) => {
      switch (filter.orderBy) {
        case "date":
          return filter.orderAsc ? b.date - a.date : a.date - b.date;
        case "value":
          return filter.orderAsc ? b.value - a.value : a.value - b.value;
      }
      return 0;
    });

    const transfers = transfersSorted.slice(start, limit);

    return {
      transfers,
      start,
      limit,
      total: transfersSorted.length,
    };
  }

  public async Create(transfer: Transfer): Promise<void> {
    this.transfers.push({ ...transfer });
  }

  public async Update(transferUpdate: Transfer): Promise<void> {
    const index = this.transfers.findIndex(
      (transfer) => transfer.id === transferUpdate.id
    );
    if (index < 0)
      throw new Error(`transfer not found with id ${transferUpdate.id}`);

    this.transfers[index] = { ...transferUpdate };
  }

  public async Delete(transferDeleted: Transfer): Promise<void> {
    const index = this.transfers.findIndex(
      (transfer) => transfer.id === transferDeleted.id
    );
    if (index < 0)
      throw new Error(`transfer not found with id ${transferDeleted.id}`);

    this.transfers.splice(index, 1);
  }
}

export default TransferStoreMemory;
