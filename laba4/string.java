import java.util.Scanner;

public class string {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Введите строку:");
        String input = scanner.nextLine();

        String[] words = input.split(" ");

        for (String word : words) {
            if (word.matches(".*\\d+.*|.*\\p{Punct}+.*")) {
                System.out.println(word);
            }
        }
    }
}
