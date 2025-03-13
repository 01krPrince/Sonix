package music.example.music_app.java;

class Organisation{
    public String orgname;

  Organisation(String orgname, String a){
      this.orgname = orgname;
      System.out.println("Employee constructor called : " + a);
  }

    Organisation(){
        System.out.println("Employee constructor called");
    }

}


class Employee extends Organisation{
    String name;
   Employee(String name, String orgname){
       super(orgname, "Ayush");
       this.name = name;
   }
}


class Main {
    public static void main(String[] args) {
        Employee newEmp = new Employee("prince","coding age");

    }
}