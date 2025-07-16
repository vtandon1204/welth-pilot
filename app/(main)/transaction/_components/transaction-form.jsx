"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2, Repeat } from "lucide-react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";

import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { cn } from "@/lib/utils";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import { ReceiptScanner } from "./recipt-scanner";
import { Card, CardContent } from "@/components/ui/card";

export function AddTransactionForm({
  accounts,
  categories,
  editMode = false,
  initialData = null,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((ac) => ac.isDefault)?.id,
            date: new Date(),
            isRecurring: false,
          },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const onSubmit = (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };

    if (editMode) {
      transactionFn(editId, formData);
    } else {
      transactionFn(formData);
    }
  };

  const handleScanComplete = (scannedData) => {
    if (!scannedData) return;
    console.log(scannedData);

    setValue("amount", scannedData.amount.toString());
    setValue("date", new Date(scannedData.date));

    if (scannedData.description) {
      setValue("description", scannedData.description);
    }

    if (scannedData.category) {
      const matchedCategory = categories.find(
        (cat) =>
          cat.name.toLowerCase().trim() ===
          scannedData.category.toLowerCase().trim()
      );

      if (matchedCategory) {
        setValue("category", matchedCategory.id);
      } else {
        const fallbackCategory = categories.find(
          (cat) => cat.name.toLowerCase() === "other expenses"
        );

        if (fallbackCategory) {
          setValue("category", fallbackCategory.id);
          toast.warning(
            `Category "${scannedData.category}" not found. Using "Other Expenses".`
          );
        } else {
          toast.warning(`Category "${scannedData.category}" not found`);
        }
      }
    }

    toast.success("Receipt scanned successfully");
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(
        editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully"
      );
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode]);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  return (
    <Card className="w-full max-w-3xl mx-auto p-6 shadow-md">
      <CardContent className="p-0">
        {/* <h2 className="text-2xl font-semibold mb-6">
          {editMode ? "Edit Transaction" : "Add New Transaction"}
        </h2> */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}

          <div className="space-y-4">
            {/* Type */}
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select
                onValueChange={(value) => setValue("type", value)}
                defaultValue={type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                  <SelectItem value="INCOME">Income</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            {/* Amount and Account */}
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Amount</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("amount")}
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Account</label>
                <Select
                  onValueChange={(value) => setValue("accountId", value)}
                  defaultValue={getValues("accountId")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} (₹
                        {parseFloat(account.balance).toFixed(2)})
                      </SelectItem>
                    ))}
                    <CreateAccountDrawer>
                      <Button
                        variant="ghost"
                        className="w-full text-left text-sm hover:bg-accent"
                      >
                        + Create Account
                      </Button>
                    </CreateAccountDrawer>
                  </SelectContent>
                </Select>
                {errors.accountId && (
                  <p className="text-sm text-red-500">
                    {errors.accountId.message}
                  </p>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select
                onValueChange={(value) => setValue("category", value)}
                defaultValue={getValues("category")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.category && (
                <p className="text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start pl-3 pr-2 text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => setValue("date", date)}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Enter description"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Recurring */}
            <div className="flex justify-between items-center border p-4 rounded-md bg-muted">
              <div>
                <label className="text-base font-medium flex items-center gap-1">
                  <Repeat className="w-4 h-4" />
                  Recurring Transaction
                </label>
                <p className="text-sm text-muted-foreground">
                  Set up a recurring schedule
                </p>
              </div>
              <Switch
                checked={isRecurring}
                onCheckedChange={(checked) => setValue("isRecurring", checked)}
              />
            </div>

            {/* Recurring Interval */}
            {isRecurring && (
              <div>
                <label className="text-sm font-medium">
                  Recurring Interval
                </label>
                <Select
                  onValueChange={(value) =>
                    setValue("recurringInterval", value)
                  }
                  defaultValue={getValues("recurringInterval")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAILY">Daily</SelectItem>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="YEARLY">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                {errors.recurringInterval && (
                  <p className="text-sm text-red-500">
                    {errors.recurringInterval.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end items-center gap-4 pt-6 border-t mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={transactionLoading}>
              {transactionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editMode ? "Updating..." : "Creating..."}
                </>
              ) : editMode ? (
                "Update Transaction"
              ) : (
                "Create Transaction"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
