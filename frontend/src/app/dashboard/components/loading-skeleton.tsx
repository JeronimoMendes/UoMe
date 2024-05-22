import { Skeleton } from "@/components/ui/skeleton";

const SVGSkeleton = ({ className }) => (
  <svg
    className={
      className + " animate-pulse rounded bg-gray-300"
    }
  />
)

const LoadingSkeleton = () => (
    <>
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="space-y-4">
        <div className="mt-2 space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="border shadow-sm">
              <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight">
                  <Skeleton className="w-[56px] max-w-full" />
                </h3>
                <SVGSkeleton className="w-4 h-4" />
              </div>
              <div className="p-6 pt-0">
                <div>
                  <Skeleton className="w-[32px] max-w-full" />
                </div>
              </div>
            </div>
            <div className="border shadow-sm">
              <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight">
                  <Skeleton className="w-[96px] max-w-full" />
                </h3>
                <SVGSkeleton className="w-4 h-4" />
              </div>
              <div className="p-6 pt-0">
                <div>
                  <Skeleton className="w-[32px] max-w-full" />
                </div>
              </div>
            </div>
            <div className="border shadow-sm">
              <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight">
                  <Skeleton className="w-[104px] max-w-full" />
                </h3>
                <SVGSkeleton className="w-4 h-4" />
              </div>
              <div className="p-6 pt-0">
                <div>
                  <Skeleton className="w-[32px] max-w-full" />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="border shadow-sm col-span-4 md:col-span-3">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="leading-none tracking-tight">
                  <Skeleton className="w-[120px] max-w-full" />
                </h3>
                <p>
                  <Skeleton className="w-[200px] max-w-full" />
                </p>
              </div>
              <div className="p-6 pt-0">
                <div className="space-y-8">
                  <div className="shrink-0 bg-border h-[1px] w-full"></div>
                  <div className="flex items-center">
                    <span className="relative flex shrink-0 h-9 w-9">
                      <span className="flex h-full w-full items-center justify-center">
                        <Skeleton className="w-[14px] max-w-full" />
                      </span>
                    </span>
                    <div className="ml-4 space-y-1 flex-grow">
                      <p className="leading-none text-left">
                        <Skeleton className="w-[136px] max-w-full" />
                      </p>
                      <p className="text-left">
                        <Skeleton className="w-[72px] max-w-full" />
                      </p>
                    </div>
                    <div className="ml-auto space-y-2 text-right">
                      <p className="leading-none">
                        <Skeleton className="w-[56px] max-w-full" />
                      </p>
                      <p>
                        <Skeleton className="w-[40px] max-w-full" />
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 bg-border h-[1px] w-full"></div>
                  <div className="flex items-center">
                    <span className="relative flex shrink-0 h-9 w-9">
                      <span className="flex h-full w-full items-center justify-center">
                        <Skeleton className="w-[14px] max-w-full" />
                      </span>
                    </span>
                    <div className="ml-4 space-y-1 flex-grow">
                      <p className="leading-none text-left">
                        <Skeleton className="w-[64px] max-w-full" />
                      </p>
                      <p className="text-left">
                        <Skeleton className="w-[72px] max-w-full" />
                      </p>
                    </div>
                    <div className="ml-auto space-y-2 text-right">
                      <p className="leading-none">
                        <Skeleton className="w-[40px] max-w-full" />
                      </p>
                      <p>
                        <Skeleton className="w-[80px] max-w-full" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default LoadingSkeleton;
