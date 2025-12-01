/*
/// Module: example1
module example1::example1;
*/

// For Move coding conventions, see
// https://docs.iota.org/developer/iota-101/move-overview/conventions


module example1::example1{
    use std::string::{String,utf8};

    fun hello_iota():vector<u8>{
        b"Hello IOTA"
    }

    public fun hello_world():String{
        let bytes = hello_iota();
        utf8(bytes)
    }

    public fun add(a:u64,b:u64):u64{
        a + b
    }

    public fun mul(a:u64,b:u64):u64{
        a * b
    }

    public fun divide(a:u64,b:u64):u64{
        a / b
    }

   public fun counter_iterative(a: u64): u64 {
        // 處理基礎情況
        if (a < 2) {
            return 1;
        };

        // 我們的基礎情況是 F(0) = 1, F(1) = 1
        let mut prev_prev = 1; // 代表 F(n-2)，初始為 F(0)
        let mut prev = 1;      // 代表 F(n-1)，初始為 F(1)
        let mut current = 0;   // 用來儲存 F(n)

        let mut i = 2;         // 我們從 F(2) 開始計算

        // 迴圈計算 F(2), F(3), ..., 直到 F(a)
        while (i <= a) {
            // 費氏數列的核心：F(n) = F(n-1) + F(n-2)
            current = prev + prev_prev;

            // 更新變數，為下一次迴圈做準備
            prev_prev = prev;
            prev = current;

            i = i + 1;
        };

        // 當迴圈結束時，prev 儲存的就是 F(a) 的結果
        prev
    }



}